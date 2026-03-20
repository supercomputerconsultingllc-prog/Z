const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outPath = path.resolve(__dirname, '..', 'release/store-assets/assets/icon/app-icon-1024.png');
const width = 1024;
const height = 1024;
const bytesPerPixel = 4;

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const name = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
  return Buffer.concat([len, name, data, crc]);
}

function setPixel(data, x, y, rgba) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const rowOffset = y * (width * bytesPerPixel + 1);
  const i = rowOffset + 1 + x * bytesPerPixel;
  data[i] = rgba[0];
  data[i + 1] = rgba[1];
  data[i + 2] = rgba[2];
  data[i + 3] = rgba[3];
}

function fillRect(data, x, y, w, h, rgba) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) setPixel(data, xx, yy, rgba);
  }
}

function fillCircle(data, cx, cy, r, rgba) {
  const r2 = r * r;
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(data, x, y, rgba);
    }
  }
}

const raw = Buffer.alloc((width * bytesPerPixel + 1) * height, 0);
for (let y = 0; y < height; y++) {
  raw[y * (width * bytesPerPixel + 1)] = 0;
  for (let x = 0; x < width; x++) {
    const t = y / (height - 1);
    const r = Math.round(8 + 12 * t);
    const g = Math.round(18 + 22 * t);
    const b = Math.round(28 + 18 * t);
    setPixel(raw, x, y, [r, g, b, 255]);
  }
}

fillCircle(raw, 512, 512, 360, [34, 197, 94, 255]);
fillCircle(raw, 512, 512, 310, [22, 163, 74, 255]);
fillCircle(raw, 392, 430, 54, [9, 12, 18, 255]);
fillCircle(raw, 632, 430, 54, [9, 12, 18, 255]);
fillRect(raw, 360, 640, 304, 52, [9, 12, 18, 255]);
fillRect(raw, 320, 704, 384, 26, [250, 204, 21, 255]);
fillRect(raw, 360, 760, 80, 140, [250, 204, 21, 255]);
fillRect(raw, 472, 760, 80, 180, [250, 204, 21, 255]);
fillRect(raw, 584, 760, 80, 120, [250, 204, 21, 255]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, png);
console.log(`Wrote ${outPath}`);
