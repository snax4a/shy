/**
 * Webpack config for development
 */

import makeWebpackConfig from './webpack.make';

export default makeWebpackConfig({
  BUILD: false,
  TEST: false,
  DEV: true
});
