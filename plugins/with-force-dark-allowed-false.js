const { withAndroidStyles } = require('expo/config-plugins');

const withForceDarkAllowedFalse = (config) => {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;

    console.log('🔧 [ForceDarkAllowed Plugin] Starting plugin execution...');

    // Ensure we have styles to work with
    if (!styles.resources) {
      console.log(
        '🔧 [ForceDarkAllowed Plugin] No resources found, creating empty object'
      );
      styles.resources = {};
    }

    if (!styles.resources.style) {
      console.log('🔧 [ForceDarkAllowed Plugin] No styles found in resources');
      return config;
    }

    // Convert to array if it's a single style object
    const styleArray = Array.isArray(styles.resources.style)
      ? styles.resources.style
      : [styles.resources.style];

    console.log(
      `🔧 [ForceDarkAllowed Plugin] Found ${styleArray.length} style(s)`
    );

    styleArray.forEach((style, index) => {
      // Ensure the style has attributes (like name)
      if (!style.$ || !style.$.name) {
        console.log(
          `🔧 [ForceDarkAllowed Plugin] Style ${index + 1} has no name attribute, skipping`
        );
        return;
      }

      console.log(
        `🔧 [ForceDarkAllowed Plugin] Processing style: ${style.$.name}`
      );

      // Initialize items array if it doesn't exist
      if (!style.item) {
        style.item = [];
      }

      // Ensure style.item is an array
      if (!Array.isArray(style.item)) {
        style.item = [style.item];
      }

      // Check if android:forceDarkAllowed already exists
      const existingItemIndex = style.item.findIndex(
        (item) => item.$ && item.$.name === 'android:forceDarkAllowed'
      );

      if (existingItemIndex !== -1) {
        // Update existing item to ensure it's set to false
        style.item[existingItemIndex]._ = 'false';
        console.log(
          `✅ [ForceDarkAllowed Plugin] Updated android:forceDarkAllowed to false for style: ${style.$.name}`
        );
      } else {
        // Add new item if it doesn't exist
        style.item.push({
          $: {
            name: 'android:forceDarkAllowed',
          },
          _: 'false',
        });
        console.log(
          `✅ [ForceDarkAllowed Plugin] Added android:forceDarkAllowed=false to style: ${style.$.name}`
        );

        // Add a test item to verify the plugin is working
        style.item.push({
          $: {
            name: 'android:testForceDarkPlugin',
          },
          _: 'true',
        });
        console.log(
          `✅ [ForceDarkAllowed Plugin] Added test item to style: ${style.$.name}`
        );
      }
    });

    // Update the styles back to the resources
    styles.resources.style = styleArray;

    console.log('🔧 [ForceDarkAllowed Plugin] Plugin execution completed');

    return config;
  });
};

module.exports = withForceDarkAllowedFalse;
