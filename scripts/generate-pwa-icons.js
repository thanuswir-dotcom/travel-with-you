import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create uncompressed/deflated PNG buffer
function createPng(size, isMaskable = false) {
  const width = size;
  const height = size;
  
  // RGBA buffer (4 bytes per pixel) + 1 filter byte per scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? size * 0.48 : size * 0.42;
  const cornerRadius = size * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded rectangle background check (for standard icon)
      let insideBg = false;
      if (isMaskable) {
        // Full bleed background for maskable
        insideBg = true;
      } else {
        // Rounded squircle background
        const nx = Math.abs(x - cx);
        const ny = Math.abs(y - cy);
        const half = size * 0.45;
        if (nx <= half && ny <= half) {
          const cornerX = nx - (half - cornerRadius);
          const cornerY = ny - (half - cornerRadius);
          if (cornerX > 0 && cornerY > 0) {
            insideBg = (cornerX * cornerX + cornerY * cornerY) <= cornerRadius * cornerRadius;
          } else {
            insideBg = true;
          }
        }
      }

      if (!insideBg) {
        // Transparent
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Base gradient: Deep Slate to Dark Teal/Emerald (#090d16 -> #064e3b)
      const gradRatio = (x + y) / (width + height);
      let r = Math.round(9 + gradRatio * (15 - 9));
      let g = Math.round(15 + gradRatio * (78 - 15));
      let b = Math.round(26 + gradRatio * (59 - 26));
      let a = 255;

      // Draw Glowing Emerald Outer Ring
      const ringRadius = size * 0.32;
      const ringWidth = size * 0.035;
      if (Math.abs(dist - ringRadius) < ringWidth) {
        // Glowing cyan/emerald border
        r = 16;
        g = 185;
        b = 129;
      }

      // Draw stylized compass / travel pin in center
      // Location pin shape: circle at top + triangle pointing down
      const pinCenterY = cy - size * 0.04;
      const pinDx = x - cx;
      const pinDy = y - pinCenterY;
      const pinDist = Math.sqrt(pinDx * pinDx + pinDy * pinDy);
      const headRadius = size * 0.16;

      let insidePin = false;
      if (pinDist <= headRadius) {
        insidePin = true;
      } else if (y >= pinCenterY && y <= cy + size * 0.22) {
        // Triangular point
        const progress = (y - pinCenterY) / (size * 0.26);
        const allowedWidth = headRadius * (1 - progress);
        if (Math.abs(pinDx) <= allowedWidth) {
          insidePin = true;
        }
      }

      if (insidePin) {
        // Inner cutout for pin
        if (pinDist <= headRadius * 0.42 && y <= pinCenterY + headRadius * 0.3) {
          // Hollow center showing dark background
          r = 15;
          g = 23;
          b = 42;
        } else {
          // Vibrant Emerald & Cyan gradient for pin (#10b981 to #06b6d4)
          const pinRatio = (y - (pinCenterY - headRadius)) / (size * 0.4);
          r = Math.round(16 + pinRatio * (6 - 16));
          g = Math.round(185 + pinRatio * (182 - 185));
          b = Math.round(129 + pinRatio * (212 - 129));
        }
      }

      // Write RGBA
      rawData[pxOffset] = Math.max(0, Math.min(255, r));
      rawData[pxOffset + 1] = Math.max(0, Math.min(255, g));
      rawData[pxOffset + 2] = Math.max(0, Math.min(255, b));
      rawData[pxOffset + 3] = a;
    }
  }

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

// Ensure output directories
const iconsDir = path.resolve(__dirname, '../frontend/public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate Icons
console.log('Generating PWA Icons...');
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, false));
console.log('✔ Generated icon-192.png');

fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, false));
console.log('✔ Generated icon-512.png');

fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), createPng(512, true));
console.log('✔ Generated icon-maskable-512.png');

fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPng(180, false));
console.log('✔ Generated apple-touch-icon.png');

console.log('🎉 All PWA icons generated successfully in frontend/public/icons!');
