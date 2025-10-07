// withAndroidSigningConfigs.js
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to set signingConfigs in android/app/build.gradle
 * @param config - Expo config
 * @param options - { release: { storeFile, storePassword, keyAlias, keyPassword }, debug: { ... } }
 */
function withAndroidSigningConfigs(config, options = {}) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const indent = '    ';
      const indent2 = indent + indent;
      const indent3 = indent2 + indent;
      const indent4 = indent3 + indent;

      const buildGradlePath = path.join(
        config.modRequest.projectRoot,
        'android',
        'app',
        'build.gradle'
      );
      let content = fs.readFileSync(buildGradlePath, 'utf8');

      // Regex to precisely match signingConfigs block (robust multiline, optional end whitespace)
      const regexSigningConfigs = /(signingConfigs\s*{[\s\S]*?^\s*})[\s]*/m;

      content = content.replace(regexSigningConfigs, (match) => {
        const _match = match;
        let updated = _match.trimEnd();

        if (options.release) {
          const regexRelease = /release\s*{[\s\S]*?^\s*}/m;
          let newReleaseConfig = [
            `${indent2}release {`,
            options.release.propertyCheck
              ? `${indent3}if (project.hasProperty('${options.release.propertyCheck}')) {`
              : '',
            options.release.storeFile
              ? `${indent4}storeFile ${options.release.storeFile}`
              : '',
            options.release.storePassword
              ? `${indent4}storePassword ${options.release.storePassword}`
              : '',
            options.release.keyAlias
              ? `${indent4}keyAlias ${options.release.keyAlias}`
              : '',
            options.release.keyPassword
              ? `${indent4}keyPassword ${options.release.keyPassword}`
              : '',
            options.release.propertyCheck ? `${indent3}}` : '',
            `${indent2}}`,
          ]
            .filter(Boolean)
            .join('\n');

          if (regexRelease.test(updated)) {
            newReleaseConfig = newReleaseConfig.trimStart().replace(/}$/, '');
            updated = updated.replace(regexRelease, newReleaseConfig);
          } else {
            updated = updated.replace(
              /signingConfigs\s*{/,
              `signingConfigs {\n${newReleaseConfig}`
            );
            updated += `\n${indent}`;
          }

          return updated;
        }

        if (options.debug) {
          const regexDebug = /debug\s*{[\s\S]*?^\s*}/m;
          let newDebugConfig = [
            `${indent2}debug {`,
            options.debug.storeFile
              ? `${indent3}storeFile ${options.debug.storeFile}`
              : '',
            options.debug.storePassword
              ? `${indent3}storePassword '${options.debug.storePassword}'`
              : '',
            options.debug.keyAlias
              ? `${indent3}keyAlias '${options.debug.keyAlias}'`
              : '',
            options.debug.keyPassword
              ? `${indent3}keyPassword '${options.debug.keyPassword}'`
              : '',
            `${indent2}}`,
          ]
            .filter(Boolean)
            .join('\n');

          if (regexDebug.test(updated)) {
            newDebugConfig = newDebugConfig.trimStart().replace(/}$/, '');
            updated = updated.replace(regexDebug, newDebugConfig);
          } else {
            updated = updated.replace(
              /signingConfigs\s*{/,
              `signingConfigs {\n${newDebugConfig}`
            );
          }

          return updated;
        }

        return match;
      });

      fs.writeFileSync(buildGradlePath, content);

      // Update buildTypes.release.signingConfig to signingConfigs.release
      const buildTypesReleaseRegex =
        /(buildTypes\s*{[\s\S]*?release\s*{[\s\S]*?)(signingConfig\s+[^\n]+)?([\s\S]*?^\s*})/m;
      content = content.replace(
        buildTypesReleaseRegex,
        (match, prefix, signingConfigLine, suffix) => {
          // Remove any existing signingConfig line
          let updated = prefix.replace(/signingConfig\s+[^\n]+\n?/g, '');
          // Add the correct signingConfig line before the closing }
          updated += `${indent2}signingConfig signingConfigs.release\n`;
          updated += suffix;
          return updated;
        }
      );

      return config;
    },
  ]);
}

module.exports = withAndroidSigningConfigs;
