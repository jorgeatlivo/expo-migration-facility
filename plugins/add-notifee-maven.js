const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MAVEN_URL_LINE =
  'url "$rootDir/../node_modules/@notifee/react-native/android/libs"';

function withNotifeeMaven(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const buildGradlePath = path.join(projectRoot, 'android', 'build.gradle');
      let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

      const repositoriesBlockRegex =
        /(allprojects\s*{\s*repositories\s*{)([\s\S]*?)(^\s*}\s*^\s*})/m;
      const match = buildGradle.match(repositoriesBlockRegex);

      if (!match) {
        throw new Error(
          'Cannot find allprojects > repositories in android/build.gradle'
        );
      }

      const repositoriesStart = match.index + match[1].length;
      const repositoriesContent = match[2];
      const repositoriesEnd = match.index + match[0].length - match[3].length;

      const mavenBlockRegex = /maven\s*{([\s\S]*?)}/g;
      let targetMavenBlockStart = -1;
      let targetMavenBlockEnd = -1;
      let targetMavenBlockContent = null;
      let matchMaven;

      while (
        (matchMaven = mavenBlockRegex.exec(repositoriesContent)) !== null
      ) {
        const mavenBlock = matchMaven[0];
        if (mavenBlock.includes('url(reactNativeAndroidDir)')) {
          targetMavenBlockStart = matchMaven.index;
          targetMavenBlockEnd = mavenBlockRegex.lastIndex;
          targetMavenBlockContent = mavenBlock;
          break;
        }
      }

      // If no maven block found, add Notifee repo directly
      if (targetMavenBlockStart === -1) {
        console.log('[notifee] Maven block not found — adding manually.');
        const mavenBlock = `
    maven {
      ${MAVEN_URL_LINE}
    }
  `;
        buildGradle =
          buildGradle.slice(0, repositoriesEnd) +
          mavenBlock +
          buildGradle.slice(repositoriesEnd);

        fs.writeFileSync(buildGradlePath, buildGradle);
        return config;
      }

      // If block exists but Notifee repo missing
      if (!targetMavenBlockContent.includes(MAVEN_URL_LINE)) {
        const lines = targetMavenBlockContent.split('\n');
        const newLines = [];
        for (const line of lines) {
          newLines.push(line);
          if (line.includes('url(reactNativeAndroidDir)')) {
            const indentMatch = line.match(/^(\s*)/);
            const indent = indentMatch ? indentMatch[1] : '';
            newLines.push(`${indent}${MAVEN_URL_LINE}`);
          }
        }
        const newMavenBlockContent = newLines.join('\n');

        const before = repositoriesContent.slice(0, targetMavenBlockStart);
        const after = repositoriesContent.slice(targetMavenBlockEnd);
        const newRepositoriesContent = before + newMavenBlockContent + after;

        buildGradle =
          buildGradle.slice(0, repositoriesStart) +
          newRepositoriesContent +
          buildGradle.slice(repositoriesEnd);

        fs.writeFileSync(buildGradlePath, buildGradle);
      }

      return config;
    },
  ]);
}

module.exports = function (config) {
  return withNotifeeMaven(config);
};
