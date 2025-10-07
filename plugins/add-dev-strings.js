const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withDevResStringsXml(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const valuesDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'dev',
        'res',
        'values'
      );
      const stringsXmlPath = path.join(valuesDir, 'strings.xml');
      const content = `<resources>
    <string name="app_name">Livo Centros DEV</string>
</resources>
`;

      // Create values folder if it doesn't exist
      if (!fs.existsSync(valuesDir)) {
        fs.mkdirSync(valuesDir, { recursive: true });
      }

      // Write strings.xml file
      fs.writeFileSync(stringsXmlPath, content, { encoding: 'utf8' });
      console.log(`[withDevResStringsXml] Wrote dev/values/strings.xml`);

      return config;
    },
  ]);
}

module.exports = withDevResStringsXml;
