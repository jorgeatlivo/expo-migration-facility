const fs = require('fs');
const path = require('path');
const plistModule = require('@expo/plist');
const plist = plistModule.default || plistModule;

const CUSTOM_PLIST_FILENAME = 'Livo Dev-info.plist';
const CUSTOM_PLIST_PATH = `ios/${CUSTOM_PLIST_FILENAME}`;

/**
 * Expo config plugin: Update CFBundleVersion in ios/Livo Dev-info.plist
 * to match ios.buildNumber in app.config.js
 */
module.exports = function withCustomPlistVersion(config) {
  const buildNumber = config.ios?.buildNumber;
  // Get expo.version (should be synced with APP_VERSION)
  const shortVersion = config.version || config.expo?.version;

  // Ensure buildNumber and shortVersion are set, otherwise skip
  if (!buildNumber || !shortVersion) {
    console.warn(
      '[expo-update-custom-plist-version] ios.buildNumber or expo.version is not set in app.config.js, skipping custom plist update.'
    );
    return config;
  }

  // Determine plist absolute path
  const projectRoot = config._internal?.projectRoot || process.cwd();
  const plistPath = path.join(projectRoot, CUSTOM_PLIST_PATH);

  // Check if plist file exists
  if (!fs.existsSync(plistPath)) {
    console.warn(
      `[expo-update-custom-plist-version] ${CUSTOM_PLIST_PATH} not found, skipping update.`
    );
    return config;
  }

  // Read, update, and write back plist
  try {
    const plistContent = fs.readFileSync(plistPath, 'utf8');
    const parsedPlist = plist.parse(plistContent);
    parsedPlist.CFBundleVersion = buildNumber;
    parsedPlist.CFBundleShortVersionString = shortVersion;
    const updatedContent = plist.build(parsedPlist);
    fs.writeFileSync(plistPath, updatedContent);
    console.log(
      `[expo-update-custom-plist-version] Updated CFBundleVersion to ${buildNumber} and CFBundleShortVersionString to ${shortVersion} in ${CUSTOM_PLIST_PATH}.`
    );
  } catch (e) {
    console.error(
      `[expo-update-custom-plist-version] Failed to update ${CUSTOM_PLIST_PATH}:`,
      e
    );
  }

  return config;
};
