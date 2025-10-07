const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to inject productFlavors cleanly (no marker).
 */
function withAndroidFlavors(config, options = {}) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const buildGradlePath = path.join(
        config.modRequest.projectRoot,
        'android',
        'app',
        'build.gradle'
      );
      let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

      // Check for existing productFlavors
      if (/productFlavors\s*\{[\s\S]*?\}/.test(buildGradle)) {
        console.log('[withAndroidFlavors] Flavors already exist, skip inject.');
        return config;
      }

      // Inject after defaultConfig block
      const pattern = /(defaultConfig\s*{[^}]*})/m;
      const match = buildGradle.match(pattern);
      if (match) {
        // Detect indent from the last line of defaultConfig block
        const lines = match[0].split('\n');
        const lastLine = lines[lines.length - 1];
        const indentMatch = lastLine.match(/^(\s*)\}/);
        const indent = indentMatch ? indentMatch[1] : '    '; // fallback 4 spaces

        const flavorsBlock = [
          '',
          `${indent}flavorDimensions "default"`,
          `${indent}productFlavors {`,
          `${indent}    dev {`,
          `${indent}        dimension "default"`,
          `${indent}        applicationIdSuffix ".dev"`,
          `${indent}        versionNameSuffix "-dev"`,
          `${indent}    }`,
          `${indent}    prod {`,
          `${indent}        dimension "default"`,
          `${indent}    }`,
          `${indent}}`,
          '',
        ].join('\n');

        buildGradle = buildGradle.replace(
          match[0],
          `${match[0]}\n${flavorsBlock}`
        );
        fs.writeFileSync(buildGradlePath, buildGradle);
        console.log('[withAndroidFlavors] Flavors injected.');
      } else {
        console.warn(
          '[withAndroidFlavors] Could not find defaultConfig block.'
        );
      }
      return config;
    },
  ]);
}

module.exports = withAndroidFlavors;
