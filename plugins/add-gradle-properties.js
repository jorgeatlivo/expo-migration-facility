// withAndroidGradleProperties.js
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to set or update properties in android/gradle.properties
 * @param config - Expo config
 * @param options - { properties: Record<string, string|boolean|number> }
 * @returns config
 */
function withAndroidGradleProperties(config, options = {}) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const gradlePropsPath = path.join(
        config.modRequest.projectRoot,
        'android',
        'gradle.properties'
      );
      let content = fs.readFileSync(gradlePropsPath, 'utf8');

      if (options.properties && typeof options.properties === 'object') {
        // Parse file to key-value
        let lines = content.split('\n');
        const propKeys = Object.keys(options.properties);

        // Map for easy lookup
        const keySet = new Set(propKeys);
        const found = new Set();

        // Update existing lines, including commented properties
        lines = lines.map((line) => {
          // Match both commented and uncommented property lines
          const match = line.match(/^\s*#?\s*([\w\.-_]+)\s*=\s*(.*)$/);
          if (match && keySet.has(match[1])) {
            found.add(match[1]);
            // Preserve inline comment (not the leading # for property)
            let comment = '';
            const eqIdx = line.indexOf('=');
            const hashIdx = line.indexOf('#');
            if (hashIdx > -1 && eqIdx > -1 && hashIdx > eqIdx) {
              comment = ' ' + line.slice(hashIdx);
            }
            return `${match[1]}=${options.properties[match[1]]}${comment}`;
          }
          return line;
        });

        // Remove ALL trailing blank lines
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
          lines.pop();
        }

        // Append only new keys strictly at the end
        propKeys.forEach((key) => {
          if (!found.has(key)) {
            lines.push(`${key}=${options.properties[key]}`);
          }
        });

        // Always add exactly one newline at the end (POSIX standard)
        let newContent = lines.join('\n') + '\n';

        // Normalize both contents for comparison (remove trailing blank lines, ensure single newline)
        let originalLines = content.split('\n');
        while (
          originalLines.length > 0 &&
          originalLines[originalLines.length - 1].trim() === ''
        ) {
          originalLines.pop();
        }
        let normalizedOriginal = originalLines.join('\n') + '\n';

        // Only write if content actually changed
        if (normalizedOriginal !== newContent) {
          fs.writeFileSync(gradlePropsPath, newContent);
        }
      }

      return config;
    },
  ]);
}

module.exports = withAndroidGradleProperties;
