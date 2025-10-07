const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MIPMAP_SPECS = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

function withDevMipmapAppIcon(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const srcFile = path.join(
        projectRoot,
        'assets',
        'store',
        'app-icon-1024.dev.png'
      );
      const resBaseDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'dev',
        'res'
      );

      if (!fs.existsSync(srcFile)) {
        console.warn(
          `[withDevMipmapAppIcon] App icon source ${srcFile} not found, skipping mipmap copy.`
        );
        return config;
      }
      if (!fs.existsSync(resBaseDir)) {
        console.warn(
          `[withDevMipmapAppIcon] Dev res folder ${resBaseDir} not found, creating...`
        );
        fs.mkdirSync(resBaseDir, { recursive: true });
      }

      for (const { folder, size } of MIPMAP_SPECS) {
        const destDir = path.join(resBaseDir, folder);

        // Nếu folder chưa tồn tại thì tự tạo
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        const destFile = path.join(destDir, 'ic_launcher.webp');

        try {
          const iconBuffer = await sharp(srcFile)
            .resize(size, size, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .webp({ quality: 100 })
            .toBuffer();

          let needCopy = true;
          if (fs.existsSync(destFile)) {
            const destBuffer = fs.readFileSync(destFile);
            if (Buffer.compare(iconBuffer, destBuffer) === 0) {
              needCopy = false;
            }
          }
          if (needCopy) {
            fs.writeFileSync(destFile, iconBuffer);
            console.log(
              `[withDevMipmapAppIcon] Copied & resized app icon -> ${folder}/ic_launcher.webp (${size}x${size})`
            );
          }
        } catch (e) {
          console.error(
            `[withDevMipmapAppIcon] Error processing ${folder}:`,
            e.message
          );
        }
      }

      return config;
    },
  ]);
}

module.exports = withDevMipmapAppIcon;
