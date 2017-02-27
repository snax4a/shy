/* eslint-env node */
'use strict';

import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

module.exports = function makeWebpackConfig(options) {
  // Set by gulpfile.babel.js or karma.conf.js
  const BUILD = !!options.BUILD;
  const TEST = !!options.TEST;
  const E2E = !!options.E2E;
  const DEV = !!options.DEV;

  let config = {
    cache: DEV,

    //context: __dirname, // current directory by default

    devServer: {
      contentBase: './client/',
      stats: {
        modules: false,
        cached: false,
        chunks: false
      }
    },

    devtool: '', // placeholder to be filled in conditionally

    // If testing, must set entry to '' to avoid Karma error (bug)
    entry: TEST ? '' : {
      app: './client/app/app.js',
      polyfills: './client/polyfills.js',
      vendor: [
        'angular',
        'angular-aria',
        // 'angular-animate', // Not using ngAnimate
        'angular-cookies',
        'angular-resource',
        'angular-messages',
        'angular-sanitize',
        'angular-ui-bootstrap',
        'angular-ui-router',
        'lodash'
      ]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader', // transpiles ES6-7 to ES5
          exclude: /node_modules/,
          options: {
            //babelrc: false, // ignore babel settings in babelrc and package.json
            //presets: [['es2015', {modules: false}]],
            cacheDirectory: true,
            shouldPrintComment: commentContents => /@ngInject/.test(commentContents), // leave ng-annotate alone
            plugins: TEST ? ['istanbul', 'transform-class-properties'] : ['transform-class-properties']
          },
          include: [
            path.resolve(__dirname, 'client/'),
            path.resolve(__dirname, 'node_modules/lodash-es/')
          ]
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
          loader: 'file-loader' // copies to dist, renaming with asset hash
        },

        {
          test: /\.pug$/,
          loader: 'pug-html-loader' // converts pug to HTML (includes pug node module)
        },

        {
          test: /\.css$/,
          use: !TEST
            // Docs: https://github.com/webpack/style-loader
            // Use style-loader in development for hot-loading
            ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
                  }
                }
              ]
            })
            // Docs: https://github.com/webpack/null-loader
            // Skip loading css in test mode
            : [{loader: 'null-loader'}]
        },

        {
          test: /\.scss$/,
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
              }
            }
          ],
          include: [
            path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
            path.resolve(__dirname, 'client/app/app.scss')
          ]
        },

        {
          // Explore https://github.com/jeffling/ng-annotate-webpack-plugin as
          // possible replacement for ng-annotate-loader (seemed slow though)
          test: /\.js$/,
          loader: 'ng-annotate-loader?single_quotes',
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

    plugins: [] // placeholder to be filled in conditionally
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

    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // vendor.js
      minChunks: Infinity // chunk is only for vendor JS
    }));

    config.plugins.push(
      // Docs: https://github.com/ampedandwired/html-webpack-plugin
      // Don't render index.html
      new HtmlWebpackPlugin({
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true
      }),
      new HtmlWebpackHarddiskPlugin()
    );
  }

  if(DEV) {
    config.plugins.push(
      // Docs: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      })
    );
    // config.plugins.push(
    //   new webpack.HotModule.ReplacementPlugin()
    // );
  }

  // Add build specific plugins
  if(BUILD) {
    config.plugins.push(
      new ExtractTextPlugin({filename: '[name].[hash].css'}),
      // Docs: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Docs: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourceMap: true,
        output: {
          comments: false
        },
        // compress: { // not needed as it's a default
        //   warnings: false
        // }
      }),

      // Docs: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    );
  }

  // For debugging
  // const util = require('util');
  //console.log('Webpack Config (as entered):', util.inspect(config, { showHidden: false, depth: null }));
  // var compiler;
  // try {
  //   compiler = webpack(config);
  //   console.log('Webpack Config (processed):', util.inspect(compiler.options, { showHidden: false, depth: null }));
  // } catch(e) {
  //   console.error(e.message);
  // }
  return config;
};
