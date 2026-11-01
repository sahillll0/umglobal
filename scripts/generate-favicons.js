const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Helper to assemble standard multi-size Windows/Web ICO containing PNG streams
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;
  
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type (1 = icon)
  header.writeUInt16LE(count, 4); // count of images
  
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }
  
  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.buffer)]);
}

async function main() {
  console.log('Generating UM Global Exim Favicons & Icons...');

  // 1. Crop emblem from logo.jpg (center: x=512, y=440)
  const input = sharp(path.join(__dirname, '../public/logo.jpg'));
  const cropped = await input.extract({ left: 222, top: 150, width: 580, height: 580 }).toBuffer();
  
  // 2. Make transparent background with anti-aliasing
  const { data, info } = await sharp(cropped).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r > 235 && g > 235 && b > 235) {
      data[i+3] = 0;
    } else if (r > 210 && g > 210 && b > 210) {
      const avg = (r + g + b) / 3;
      data[i+3] = Math.max(0, Math.min(255, Math.round((255 - avg) * 5)));
    }
  }

  // 3. Create high-res 512x512 transparent emblem centered with elegant margin
  const emblemRaw = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  });
  
  const emblemResized = await emblemRaw.clone()
    .resize(460, 460, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const base512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    {
      input: emblemResized,
      gravity: 'center'
    }
  ])
  .png()
  .toBuffer();

  // 4. Generate multi-resolution PNGs for ICO
  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = [];
  for (const size of sizes) {
    const buf = await sharp(base512)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngBuffers.push({ width: size, height: size, buffer: buf });
  }

  const icoBuffer = buildIco(pngBuffers);

  // 5. Generate Apple touch icon (180x180) with clean white background & rounded brand padding
  const appleEmblem = await emblemRaw.clone()
    .resize(144, 144, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const appleIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    {
      input: appleEmblem,
      gravity: 'center'
    }
  ])
  .png()
  .toBuffer();

  // 6. Write files to app & public directories
  const publicDir = path.join(__dirname, '../public');
  const appDir = path.join(__dirname, '../src/app');

  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  fs.writeFileSync(path.join(appDir, 'icon.png'), base512);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), base512);

  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), appleIcon);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

  // 7. Write clean SVG icon for modern browser SVG favicon support
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="umBlueGrad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="50%" stop-color="#1D4ED8" />
      <stop offset="100%" stop-color="#0B132B" />
    </linearGradient>
  </defs>
  <!-- Left Arch (Curves top left down to base) -->
  <path d="M 47 10 C 27 10 12 25 12 45 L 12 88 L 32 88 L 32 75 L 24 75 L 24 45 C 24 32 34 22 47 22 Z" fill="url(#umBlueGrad)" />
  <!-- Right Arch (Curves top right down to base) -->
  <path d="M 53 10 C 73 10 88 25 88 45 L 88 88 L 76 88 L 76 45 C 76 32 66 22 53 22 Z" fill="url(#umBlueGrad)" />
  <!-- Inner M Arch -->
  <path d="M 50 27 C 38 27 30 35 30 47 L 30 88 L 43 88 L 43 56 L 50 66 L 57 56 L 57 88 L 70 88 L 70 47 C 70 35 62 27 50 27 Z M 50 37 C 54 37 57 41 57 45 L 50 55 L 43 45 C 43 41 46 37 50 37 Z" fill="url(#umBlueGrad)" />
</svg>`;

  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

  // Cleanup test files
  const test1 = path.join(__dirname, '../test_emblem.png');
  const test2 = path.join(__dirname, '../test_composite.png');
  if (fs.existsSync(test1)) fs.unlinkSync(test1);
  if (fs.existsSync(test2)) fs.unlinkSync(test2);

  console.log('Successfully generated all favicons & icons without black borders!');
}

main().catch(console.error);
