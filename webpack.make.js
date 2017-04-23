/* eslint-env node */
'use strict';

import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
//import CompressionPlugin from 'compression-webpack-plugin';

module.exports = function makeWebpackConfig(options) {
  // Set by gulpfile.babel.js or karma.conf.js
  const BUILD = !!options.BUILD;
  const TEST = options.TEST || options.E2E;
  const DEV = !!options.DEV;

  // Establish the base configuration
  let config = {
    cache: DEV,

    devtool: '', // placeholder to be filled in conditionally

    entry: { // If test, set entry to '' to avoid Karma error (bug)
      app: ['babel-polyfill', './client/app/app.js']
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'client/')
          ],
          exclude: /node_modules/,
          use: [
            {loader: 'ng-annotate-loader?single_quotes'},
            {loader: 'babel-loader', options: { cacheDirectory: true, minified: true }}
            // {
            //   loader: 'babel-loader',
            //   options: {
            //     babelrc: false,
            //     presets: [['env', {
            //       targets: {
            //         browsers: [
            //           'chrome >= 48',
            //           'firefox >= 45',
            //           'safari >= 9',
            //           'ie >= 11',
            //           'edge >= 13',
            //           'ios >= 9.3',
            //           'android >= 5.0'
            //         ],
            //         uglify: true
            //       },
            //       useBuiltIns: true,
            //       //loose: true,
            //       modules: false, //'commonjs', // changing to false adds 9K
            //       // exclude: [ // should slim the build but does not
            //       //   'transform-es2015-block-scoped-functions',
            //       //   'transform-es2015-block-scoping',
            //       //   'transform-es2015-computed-properties',
            //       //   'transform-es2015-duplicate-keys',
            //       //   'transform-es2015-function-name',
            //       //   'transform-es2015-object-super',
            //       //   'transform-es2015-spread',
            //       //   'transform-es2015-sticky-regex',
            //       //   'transform-es2015-unicode-regex',
            //       //   'transform-regenerator',
            //       //   'transform-exponentiation-operator',
            //       //   'transform-async-to-generator',
            //       //   'syntax-trailing-function-commas'
            //       // ],
            //       debug: false
            //     }]],
            //     cacheDirectory: true,
            //     comments: false,
            //     //minified: true
            //   }
            // }
          ]
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
          loader: 'file-loader' // copies to dist, renaming with asset hash to ensure the latest version is downloaded
        },

        {
          test: /\.pug$/,
          // loader: 'pug-loader' // https://github.com/pugjs/pug-loader // adds 6K
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
                  minimize: true,
                  sourceMap: false
                }
              },
              { // Shrinks CSS file by 12K
                loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
                options: {
                  plugins: () => [autoprefixer({browsers: ['last 2 versions']})],
                  sourceMap: false
                }
              },
              {
                loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
                options: {
                  outputStyle: 'compressed',
                }
              }
            ]
          })
        }
      ]
    },

    node: {
      crypto: 'empty',
      clearImmediate: false, // do not stop timer associated with callback
      setImmediate: false // do not schedule immediate callback
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
        : '"development"'}) //,

      // new CompressionPlugin({ // https://github.com/webpack-contrib/compression-webpack-plugin
      //   asset: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: /\.(js|html|css)$/,
      //   threshold: 10240,
      //   minRatio: 0.8
      // })
    ]
  };

  if(DEV) {
    config.plugins.push(
      new BundleAnalyzerPlugin({analyzerMode: 'static'})
    );
  }

  // Type of sourcemap to use per build type
  if(TEST) {
    config.devtool = 'inline-source-map';
  } else if(BUILD || DEV) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
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
      // Separate vendor chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module, count) => module.context && module.context.indexOf('node_modules') >= 0
      }),

      // Don't render index.html
      new HtmlWebpackPlugin({ // https://github.com/ampedandwired/html-webpack-plugin
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true,
        minify: {
          removeScriptTypeAttributes: true,
          removeComments: true,
          minifyJS: true
        }
      }),
      new HtmlWebpackHarddiskPlugin()
    );
  }

  // Add build specific plugins
  if(BUILD) {
    config.plugins.push(
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(), //http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin

      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({ // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        mangle: false,
        sourceMap: true,
        comments: false,
        exclude: [/\.min\.js$/gi] // skip pre-minified libs
      })
    );
  }

  // For debugging Webpack configuration
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

