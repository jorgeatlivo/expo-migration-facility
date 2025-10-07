const { withStringsXml } = require('expo/config-plugins');

module.exports = function withBlobProviderAuthority(config) {
  return withStringsXml(config, (config) => {
    if (!config.modResults.resources) {
      return config;
    }

    // Remove all <string> entries with name 'blob_provider_authority' if they exist
    config.modResults.resources.string =
      config.modResults.resources.string.filter(
        (item) => item.$.name !== 'blob_provider_authority'
      );

    return config;
  });
};
