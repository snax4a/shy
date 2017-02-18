/**
 * Webpack config for builds
 */

import makeWebpackConfig from './webpack.make';

export default makeWebpackConfig({
  BUILD: true,
  TEST: false,
  DEV: false
});
