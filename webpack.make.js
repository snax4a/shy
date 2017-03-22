/* eslint-env node */
'use strict';

import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
//import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

module.exports = function makeWebpackConfig(options) {
  // Set by gulpfile.babel.js or karma.conf.js
  const BUILD = !!options.BUILD;
  const TEST = !!options.TEST;
  const E2E = !!options.E2E;
  const DEV = !!options.DEV;

  // Establish the base configuration
  let config = {
    cache: DEV,

    // context: __dirname, // current directory by default

    // Not relevant as webpack-dev-server not in use
    // devServer: {
    //   contentBase: './client/',
    //   stats: {
    //     modules: false,
    //     cached: false,
    //     chunks: false
    //   }
    // },

    devtool: '', // placeholder to be filled in conditionally

    entry: TEST ? '' : { // If test, set entry to '' to avoid Karma error (bug)
      app: ['./client/app/app.js'],
      polyfills: 'babel-polyfill', // must use polyfill for ie support instead of transform-runtime
      vendor: [ // bundle stuff that changes seldomly
        'angular',
        'angular-aria',
        'angular-cookies',
        'angular-loading-bar',
        'angular-messages',
        'angular-resource',
        'angular-sanitize',
        'angular-ui-bootstrap',
        'angular-ui-router',
        'angular-utils-pagination',
        'braintree-web',
        'lodash' // indirect dependency
      ]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader', // transpiles ES6 and ES7 to ES5
          exclude: /node_modules/,
          options: {
            // babel settings are in package.json, list here in case I want to override
            // babelrc: false, // ignore babel settings in babelrc and package.json
            // presets: [
            //   ['env', {
            //     modules: true,
            //     targets: {
            //       browsers: ['firefox >= 45', 'chrome >= 44', 'safari >= 8', 'ie >= 11', 'edge >= 13', 'ios >= 9.2', 'android >= 5.0']
            //     }
            //   }]
            // ],
            // plugins: ['transform-class-properties'],
            shouldPrintComment: commentContents => /@ngInject/.test(commentContents), // leave ng-annotate alone
            cacheDirectory: true
          },
          include: [
            path.resolve(__dirname, 'client/')
          ]
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
          loader: 'file-loader' // copies to dist, renaming with asset hash to ensure the latest version is downloaded
        },

        {
          test: /\.pug$/,
          //loader: 'pug-loader' // https://github.com/pugjs/pug-loader
          use: ['raw-loader', 'pug-html-loader'] // https://github.com/willyelm/pug-html-loader
        },

        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader', // https://github.com/webpack/style-loader
            use: [
              {
                loader: 'css-loader', // https://github.com/webpack-contrib/css-loader
                options: {
                  sourceMap: false, // rarely need to debug CSS
                  minimize: true,
                  discardComments: {removeAll: true}
                }
              },
              {
                loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
                options: {
                  sourceMap: false,
                  plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
                }
              },
              {
                loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
                options: {
                  sourceMap: false, // rarely need to debug CSS
                  outputStyle: 'compressed',
                  precision: 10,
                  sourceComments: false
                }
              }
            ]
          }),
          include: [
            path.resolve(__dirname, 'client/app/app.scss')
          ]
        },

        {
          // Explore https://github.com/jeffling/ng-annotate-webpack-plugin as
          // possible replacement for ng-annotate-loader (seemed slow though)
          test: /\.js$/,
          loader: 'ng-annotate-loader?single_quotes', // https://github.com/huston007/ng-annotate-loader
          enforce: 'post'
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
      new ExtractTextPlugin('[name].[hash].css'), // https://github.com/webpack-contrib/extract-text-webpack-plugin

      // Define free global variables
      new webpack.DefinePlugin({ // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        'process.env.NODE_ENV': DEV ? '"development"'
        : BUILD ? '"production"'
        : TEST ? '"test"'
        : '"development"'}) //,

      // new CompressionPlugin({
      //   asset: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: /\.(js|html|css)$/,
      //   threshold: 10240,
      //   minRatio: 0.8
      // })

      // UglifyJSPlugin no longer switches loaders into minimize mode
      // new webpack.LoaderOptionsPlugin({
      //   minimize: true
      // })
    ]
  };

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

      // Output path from the view of the page - uses webpack-dev-server in development
      publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
      //publicPath: BUILD ? '/' : `http://localhost:${env.port}/`,

      // Filename for entry points - add hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points - add hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    };

    config.plugins.push(
      // Separate vendor chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', // vendor.js
        minChunks: Infinity // chunk is only for vendor JS
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
