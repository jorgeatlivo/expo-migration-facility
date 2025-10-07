const fs = require('fs');
const path = require('path');

// Read translation file
function readTranslationFile() {
  const translationPath = path.resolve(__dirname, '../src/i18n/translations/es.json');
  try {
    const content = fs.readFileSync(translationPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading translation file:', error);
    process.exit(1);
  }
}

// Extract all translation keys from the translation object
function extractTranslationKeys(translations, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(translations)) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys = [...keys, ...extractTranslationKeys(value, currentKey)];
    } else {
      keys.push(currentKey);
    }
  }
  return keys;
}

// Find all relevant source files
function findSourceFiles() {
  const sourceDir = path.resolve(__dirname, '../src');
  const result = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (
        filePath.endsWith('.js') ||
        filePath.endsWith('.jsx') ||
        filePath.endsWith('.ts') ||
        filePath.endsWith('.tsx')
      ) {
        result.push(filePath);
      }
    }
  }

  walkDir(sourceDir);
  return result;
}

// Check if a key is used in the codebase
function isKeyUsed(key, files) {
  // Escape special regex characters
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const patterns = [
    // Direct usage with t function
    `t\\(['"]${escapedKey}['"]\\)`,
    `t\\(['"]${escapedKey}['"],`,

    // Usage with useTranslation
    `useTranslation\\(['"]${escapedKey}['"]\\)`,
    `useTranslation\\(['"]${escapedKey}['"],`,

    // Usage with i18n.t
    `i18n\\.t\\(['"]${escapedKey}['"]\\)`,
    `i18n\\.t\\(['"]${escapedKey}['"],`,

    // Usage with Trans component
    `<Trans\\s+i18nKey=['"]${escapedKey}['"]`,
    `Trans\\s+i18nKey=['"]${escapedKey}['"]`,

    // Usage with options object
    `t\\(\\{\\s*i18nKey:\\s*['"]${escapedKey}['"]\\s*\\}\\)`,

    // Other common patterns
    `['"]${escapedKey}['"]`
  ];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');

      for (const pattern of patterns) {
        const regex = new RegExp(pattern);
        if (regex.test(content)) {
          return true;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  // Check if parent namespace might be used dynamically
  if (key.includes('.')) {
    const namespace = key.split('.')[0];
    const escapedNamespace = namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const dynamicPatterns = [
      `t\\(['"]${escapedNamespace}\\.`,
      `useTranslation\\(['"]${escapedNamespace}\\.`,
      `i18n\\.t\\(['"]${escapedNamespace}\\.`,
    ];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        for (const pattern of dynamicPatterns) {
          const regex = new RegExp(pattern);
          if (regex.test(content)) {
            return true; // Namespace used dynamically, can't confirm key is unused
          }
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
  }

  return false;
}

// Main function
function main() {
  console.log('Checking for unused translation keys...');

  // Read translations
  const translations = readTranslationFile();

  // Extract all keys
  const translationKeys = extractTranslationKeys(translations);
  console.log(`Found ${translationKeys.length} translation keys in es.json`);

  // Find all source files
  const sourceFiles = findSourceFiles();
  console.log(`Found ${sourceFiles.length} source files to check`);

  // Check which keys are unused
  const unusedKeys = [];
  let count = 0;
  const total = translationKeys.length;

  for (const key of translationKeys) {
    if (!isKeyUsed(key, sourceFiles)) {
      unusedKeys.push(key);
    }

    // Show progress
    count++;
    if (count % 10 === 0 || count === total) {
      process.stdout.write(`\rChecking keys: ${count}/${total} (${Math.round(count/total*100)}%)`);
    }
  }

  console.log('\n\nUnused translation keys:');
  if (unusedKeys.length === 0) {
    console.log('All translation keys are being used!');
  } else {
    unusedKeys.forEach(key => console.log(`- ${key}`));
    console.log(`\n${unusedKeys.length} unused translation keys found out of ${total} total keys (${Math.round(unusedKeys.length/total*100)}%)`);
  }
}

// Run the script
main();
