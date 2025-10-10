const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withProguardKeepRules(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const proguardFilePath = path.join(
        config.modRequest.projectRoot,
        'android',
        'app',
        'proguard-rules.pro'
      );

      const keepRules = `
        # Keep Kotlin coroutine internals used by pdfium
        -keep class kotlin.coroutines.jvm.internal.** { *; }
        -keep class kotlinx.coroutines.** { *; }
        -dontwarn kotlin.**
        -dontwarn kotlinx.coroutines.**
        `;

      if (fs.existsSync(proguardFilePath)) {
        let contents = fs.readFileSync(proguardFilePath, 'utf8');
        if (!contents.includes('-keep class kotlin.coroutines.jvm.internal')) {
          contents += '\n' + keepRules;
          fs.writeFileSync(proguardFilePath, contents, 'utf8');
          console.log(
            '✅ Added Kotlin coroutine keep rules to proguard-rules.pro'
          );
        }
      } else {
        fs.writeFileSync(proguardFilePath, keepRules, 'utf8');
        console.log(
          '✅ Created proguard-rules.pro with Kotlin coroutine keep rules'
        );
      }

      return config;
    },
  ]);
};
