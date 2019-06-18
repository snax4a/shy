import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
// import PurgecssPlugin from 'purgecss-webpack-plugin';
// import glob from 'glob-all';

// Called by gulpfile.babel.js, and server/config/express.js
export default function makeWebpackConfig(mode) {
  const webpackDebug = false; // If true, show webpack configuration after it compiles
  const analyzeBundles = false; // If true, create visualization showing size of modules
  const development = mode === 'development'; // when called by server/config/express.js:101
  const production = mode === 'production'; // when called by gulpfile.babel.js:'webpack:dist':165

  // Establish the base configuration
  let config = {

    devtool: 'source-map',

    entry: {
      app: './client/app/app.module.js'
    },

    mode,

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, 'client/')],
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false, // use .babelrc for tools and server transpile only
                presets: [
                  ['@babel/preset-env', {
                    targets: '> 2%',
                    loose: true // reduces size by 4K
                  }]
                ],
                plugins: ['@babel/plugin-transform-runtime', 'angularjs-annotate']
              }
            }
          ]
        },

        {
          test: /\.pug$/,
          use: ['html-loader?attrs=false', 'pug-html-loader'] // works
        },

        {
          test: /\.(sa|sc|c)ss$/,
          include: [
            path.resolve(__dirname, 'client/app/app.scss')
          ],
          use: [
            // In development, CSS is in app.bundle.js. In production, CSS is in app.[hash].css.
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader' // https://github.com/webpack-contrib/css-loader
            },
            { // Shrinks CSS file by 12K
              loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
              options: {
                plugins: () => [autoprefixer({ overrideBrowserslist: ['> 2%'] })]
              }
            },
            {
              loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
            }
          ]
        }
      ]
    },

    node: {
      setImmediate: false // do not schedule immediate callback // saves 4K
    },

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin(),
        // new PurgecssPlugin({
        //   paths: glob.sync([
        //     path.join(__dirname, './client/index.html'),
        //     path.join(__dirname, './client/**/*.css'),
        //     path.join(__dirname, './client/**/*.js')
        //   ])
        // })
      ]
    },

    output: {
      // Absolute output directory
      path: production ? path.join(__dirname, '/dist/client/') : __dirname,

      // Output path from the view of the page
      publicPath: '/',

      // Filename for entry points - add hash in build mode
      filename: production ? '[name].[chunkhash].js' : '[name].bundle.js',

      // Filename for non-entry points - add hash in build mode
      chunkFilename: production ? '[name].[chunkhash].js' : '[name].bundle.js'
    }, // placeholder to be filled in conditionally

    plugins: [ // others added conditionally based on env
      // Separate CSS from JS - add cache-busting hash to names for production
      new MiniCssExtractPlugin({
        filename: development ? '[name].css' : '[name].[hash].css',
        chunkFilename: development ? '[id].css' : '[id].[hash].css'
      }),

      // Define process.env.NODE_ENV, https://webpack.js.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx
      // TODO: test to see if needed (mode property may do it automatically)
      //new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(mode) }),

      new MomentLocalesPlugin(), // strip all locales except en

      // Generate index.html from _index.html with references to generated JS and CSS with hashes in their names
      new HtmlWebpackPlugin({ // https://github.com/ampedandwired/html-webpack-plugin
        template: 'client/_index.html',
        filename: production ? 'index.html' : 'client/index.html',
        alwaysWriteToDisk: true // property from HtmlWebpackHarddiskPlugin (only needed for e2e testing with Cypress)
      }),

      // Cypress e2e tests needs index.html to be written to client/ (otherwise, not needed)
      new HtmlWebpackHarddiskPlugin() // add alwaysWriteToDisk property for HtmlWebpackPlugin
    ]
  };

  // Generate visualization to examine size of modules included in project
  if(analyzeBundles) {
    config.plugins.push(
      new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    );
  }

  // Output comparison between webpack as configured vs. post-compilation
  if(webpackDebug) {
    const util = require('util');
    console.log('Webpack Config (as entered):', util.inspect(config, { showHidden: false, depth: null }));
    var compiler;
    try {
      compiler = webpack(config);
      console.log('Webpack Config (processed):', util.inspect(compiler.options, { showHidden: false, depth: null }));
    } catch(e) {
      console.error(e.message);
    }
  }

  return config;
}
