const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// srcAsset: PNG/JPG file or directory you want to copy into Images.xcassets
// assetName: asset folder name inside Images.xcassets (e.g., MyBackIcon.imageset)
function withCustomImagesxcassets(config, { srcAsset, assetName }) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosDir = path.join(projectRoot, 'ios');
      // Detect the real iOS app folder (the directory containing .xcodeproj)
      const iosAppFolder = fs
        .readdirSync(iosDir)
        .find(
          (name) =>
            fs.statSync(path.join(iosDir, name)).isDirectory() &&
            fs.existsSync(path.join(iosDir, `${name}.xcodeproj`))
        );
      if (!iosAppFolder) {
        throw new Error('Cannot detect iOS app folder!');
      }
      const xcassetsPath = path.join(iosDir, iosAppFolder, 'Images.xcassets');
      const destAssetPath = path.join(xcassetsPath, assetName);

      // Copy asset into the correct folder
      if (!fs.existsSync(destAssetPath)) {
        fs.mkdirSync(destAssetPath, { recursive: true });
      }
      const files = fs.readdirSync(srcAsset);
      for (const file of files) {
        const srcFile = path.join(srcAsset, file);
        const destFile = path.join(destAssetPath, file);
        fs.copyFileSync(srcFile, destFile);
      }
      return config;
    },
  ]);
}

module.exports = function (config) {
  // Copy AppIcon Dev.appiconset
  config = withCustomImagesxcassets(config, {
    srcAsset: path.resolve(__dirname, '../assets/ios/AppIcon Dev.appiconset'),
    assetName: 'AppIcon Dev.appiconset',
  });
  return config;
};
