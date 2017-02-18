/**
 * Webpack config for tests
 */
import makeWebpackConfig from './webpack.make';

export default makeWebpackConfig({
  BUILD: false,
  TEST: true,
  DEV: false
});
