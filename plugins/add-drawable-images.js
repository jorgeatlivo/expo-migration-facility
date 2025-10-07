const fs = require('fs');
const path = require('path');

const SCALE_MAP = {
  '': 'drawable-mdpi',
  '@1.5x': 'drawable-hdpi',
  '@2x': 'drawable-xhdpi',
  '@3x': 'drawable-xxhdpi',
  '@4x': 'drawable-xxxhdpi',
};

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

/**
 * Safely copy images from assets/android to corresponding drawable folders.
 * Do not create folders. Only copy if res/drawable-xx exists (managed by Expo).
 * Safe for prebuild --clean.
 */
module.exports = function withAddDrawableImages(config) {
  const projectRoot = config.modRequest?.projectRoot || process.cwd();
  const srcDir = path.join(projectRoot, 'assets', 'android');
  const resBaseDir = path.join(
    projectRoot,
    'android',
    'app',
    'src',
    'main',
    'res'
  );

  if (!fs.existsSync(srcDir)) {
    console.warn(
      `Source directory ${srcDir} does not exist, skipping drawable image copy.`
    );
    return config;
  }
  if (!fs.existsSync(resBaseDir)) {
    // resBaseDir chưa được Expo tạo lại, skip vòng này (prebuild sẽ gọi lại plugin sau).
    console.warn(
      `Android res folder does not exist yet, skipping drawable image copy.`
    );
    return config;
  }

  fs.readdirSync(srcDir).forEach((filename) => {
    const ext = path.extname(filename);
    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return;
    }

    const basename = path.basename(filename, ext);
    let scaleSuffix = '';
    let name = basename;

    // Detect scale suffix (e.g. @2x, @3x)
    const match = basename.match(/(.+)(@([1-4](?:\.5)?)x)$/);
    if (match) {
      name = match[1];
      scaleSuffix = match[2];
    }

    const drawableFolder = SCALE_MAP[scaleSuffix] || 'drawable-mdpi';
    const destDir = path.join(resBaseDir, drawableFolder);

    // Nếu folder drawable chưa được Expo tạo, skip
    if (!fs.existsSync(destDir)) {
      return;
    }

    const destFile = path.join(destDir, name + ext);
    const srcFile = path.join(srcDir, filename);

    let needCopy = true;
    if (fs.existsSync(destFile)) {
      const srcBuffer = fs.readFileSync(srcFile);
      const destBuffer = fs.readFileSync(destFile);
      if (Buffer.compare(srcBuffer, destBuffer) === 0) {
        needCopy = false;
      }
    }
    if (needCopy) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${filename} -> ${drawableFolder}/${name + ext}`);
    }
  });

  return config;
};
