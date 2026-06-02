// Generate minimal valid PNG icons for Pixel Pets Chrome Extension
// Uses raw PNG encoding without external dependencies

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, pixelData) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // IDAT chunk - pixel data
  // Add filter byte (0 = none) at start of each row
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      rawData[dstIdx] = pixelData[srcIdx];     // R
      rawData[dstIdx + 1] = pixelData[srcIdx + 1]; // G
      rawData[dstIdx + 2] = pixelData[srcIdx + 2]; // B
      rawData[dstIdx + 3] = pixelData[srcIdx + 3]; // A
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return crc ^ 0xFFFFFFFF;
}

function hexToRGBA(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
}

function drawPixel(pixels, width, x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= width) return;
  const idx = (y * width + x) * 4;
  const rgba = typeof color === 'string' ? hexToRGBA(color) : color;
  pixels[idx] = rgba[0];
  pixels[idx + 1] = rgba[1];
  pixels[idx + 2] = rgba[2];
  pixels[idx + 3] = rgba[3];
}

function generateIcon(size) {
  const pixels = new Uint8Array(size * size * 4);
  const ps = Math.max(1, Math.floor(size / 16));
  
  const p = (x, y, color) => {
    for (let py = 0; py < ps; py++) {
      for (let px = 0; px < ps; px++) {
        drawPixel(pixels, size, x * ps + px, y * ps + py, color);
      }
    }
  };

  // Fill background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      drawPixel(pixels, size, x, y, '#2D1B69');
    }
  }

  // Border
  for (let i = 0; i < size; i++) {
    drawPixel(pixels, size, i, 0, '#00D9FF');
    drawPixel(pixels, size, i, size - 1, '#00D9FF');
    drawPixel(pixels, size, 0, i, '#00D9FF');
    drawPixel(pixels, size, size - 1, i, '#00D9FF');
    if (size >= 48) {
      drawPixel(pixels, size, i, 1, '#00D9FF');
      drawPixel(pixels, size, i, size - 2, '#00D9FF');
      drawPixel(pixels, size, 1, i, '#00D9FF');
      drawPixel(pixels, size, size - 2, i, '#00D9FF');
    }
  }

  const c = {
    body: '#F4A460',
    bodyDark: '#CD853F',
    bodyLight: '#FFDEAD',
    eyes: '#2E8B57',
    nose: '#FF69B4'
  };

  // Cat ears
  p(4, 2, c.body); p(5, 2, c.body);
  p(10, 2, c.body); p(11, 2, c.body);
  p(4, 3, c.body); p(5, 3, c.bodyLight);
  p(10, 3, c.bodyLight); p(11, 3, c.body);

  // Cat head
  for (let x = 3; x <= 12; x++) {
    p(x, 4, c.body);
    p(x, 5, c.body);
    p(x, 6, c.body);
  }
  for (let x = 4; x <= 11; x++) {
    p(x, 7, c.body);
  }

  // Eyes
  p(5, 5, c.eyes); p(6, 5, '#1A5C3E');
  p(9, 5, c.eyes); p(10, 5, '#1A5C3E');

  // Nose
  p(7, 6, c.nose); p(8, 6, c.nose);

  // Body
  for (let x = 4; x <= 11; x++) {
    p(x, 8, c.body);
    p(x, 9, c.body);
    p(x, 10, c.body);
  }
  for (let x = 5; x <= 10; x++) {
    p(x, 9, c.bodyLight);
    p(x, 10, c.bodyLight);
  }

  // Paws
  p(4, 11, c.bodyDark); p(5, 11, c.bodyDark);
  p(10, 11, c.bodyDark); p(11, 11, c.bodyDark);

  // Tail
  p(12, 7, c.body); p(13, 6, c.body);

  return createPNG(size, size, pixels);
}

// Generate icons
const iconsDir = path.join(__dirname, 'assets', 'icons');
[16, 48, 128].forEach(size => {
  const png = generateIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png (${png.length} bytes)`);
});

console.log('All icons generated successfully!');
