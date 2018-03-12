/* eslint-env node */
'use strict';

import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

module.exports = function makeWebpackConfig(options) {
  // Passed by gulpfile.babel.js or karma.conf.js
  const DEV = !!options.DEV;
  const TEST = !!options.TEST;
  const BUILD = !!options.BUILD;

  const ANALYZE = false;

  // Establish the base configuration
  let config = {

    devtool: 'source-map',

    entry: {
      app: './client/app/app.js'
    },

    mode: BUILD ? 'production' : 'development',

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'client/')
          ],
          exclude: /node_modules/,
          use: [
            {loader: 'ng-annotate-loader'},
            {
              loader: 'babel-loader',
              options: {
                babelrc: false, // .babelrc configured for tools and server transpile only
                plugins: ['transform-runtime'],
                presets: [
                  ['env', {
                    targets: {
                      browsers: [
                        'chrome >= 59',
                        'firefox >= 52',
                        'safari >= 9',
                        'ie >= 11',
                        'ios >= 10',
                        'android >= 5.1'
                      ]
                    },
                    debug: false,
                    loose: true // saves 4K
                  }]
                ]
              }
            }
          ]
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
          loader: 'file-loader' // copies to dist, renaming with asset hash to ensure the latest version is downloaded
        },

        {
          test: /\.pug$/,
          use: ['raw-loader', 'pug-html-loader'] // https://github.com/willyelm/pug-html-loader
        },

        {
          test: /\.scss$/,
          include: [
            path.resolve(__dirname, 'client/app/app.scss')
          ],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader', // https://github.com/webpack/style-loader
            use: [
              {
                loader: 'css-loader', // https://github.com/webpack-contrib/css-loader
                options: {
                  minimize: true
                }
              },
              { // Shrinks CSS file by 12K
                loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
                options: {
                  plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
                }
              },
              {
                loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
              }
            ]
          })
        }
      ]
    },

    node: {
      setImmediate: false // do not schedule immediate callback // save 4K
    },

    output: {}, // placeholder to be filled in conditionally

    plugins: [ // others added conditionally based on env
      // Separate CSS from JS
      new ExtractTextPlugin('[name].[chunkhash].css'), // https://github.com/webpack-contrib/extract-text-webpack-plugin

      // Define free global variables
      new webpack.DefinePlugin({ // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        'process.env.NODE_ENV': DEV ? '"development"'
          : BUILD ? '"production"'
            : TEST ? '"test"'
              : '"development"'})
    ]
  };

  if(ANALYZE) {
    config.plugins.push(
      new BundleAnalyzerPlugin({analyzerMode: 'static'})
    );
  }

  if(!TEST) {
    config.output = {
      // Absolute output directory
      path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

      // Output path from the view of the page
      publicPath: '/',

      // Filename for entry points - add hash in build mode
      filename: BUILD ? '[name].[chunkhash].js' : '[name].bundle.js',

      // Filename for non-entry points - add hash in build mode
      chunkFilename: BUILD ? '[name].[chunkhash].js' : '[name].bundle.js'
    };

    config.plugins.push(
      // Generate index.html from template
      new HtmlWebpackPlugin({ // https://github.com/ampedandwired/html-webpack-plugin
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true // property from HtmlWebpackHarddiskPlugin
      }),
      new HtmlWebpackHarddiskPlugin()
    );
  } else config.devtool = 'inline-source-map';

  //For debugging Webpack configuration
  // const util = require('util');
  // console.log('Webpack Config (as entered):', util.inspect(config, { showHidden: false, depth: null }));
  // var compiler;
  // try {
  //   compiler = webpack(config);
  //   console.log('Webpack Config (processed):', util.inspect(compiler.options, { showHidden: false, depth: null }));
  // } catch(e) {
  //   console.error(e.message);
  // }

  return config;
};
