const { withDangerousMod } = require('expo/config-plugins');
const { execSync } = require('child_process');
module.exports = function withMultiTarget(config, opts) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      try {
        const defaultTargetName = config.name;
        console.log('🚀 ~ defaultTargetName:', defaultTargetName);
        let targetsArg = '';
        if (opts && Array.isArray(opts.targets)) {
          // Serialize targets as name:suffix,name:suffix
          targetsArg = opts.targets
            .map((t) => `${t.name}:${t.suffix}`)
            .join(',');
          console.log('🚀 ~ targetsArg:', targetsArg);
        } else {
          if (!opts || !Array.isArray(opts.targets)) {
            console.warn(
              '[withMultiTarget] opts.targets is missing or not an array, skipping Ruby script.'
            );
            return config;
          }
        }
        execSync(
          `ruby ./scripts/with_multi_target.rb "${defaultTargetName}" "${targetsArg}"`,
          { stdio: 'inherit' }
        );
      } catch (e) {
        console.warn('[withMultiTarget] Ruby script failed:', e.message);
      }
      return config;
    },
  ]);
};
