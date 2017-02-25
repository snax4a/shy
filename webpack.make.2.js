/* eslint-env node */
'use strict';

import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import util from 'util';

module.exports = function makeWebpackConfig(options) {
  // DEV, TEST, and BUILD are set in webpack.<env>.js, E2E set by gulpfile
  let BUILD = !!options.BUILD;
  let TEST = !!options.TEST;
  let E2E = !!options.E2E;
  let DEV = !!options.DEV;

  let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
  **/
  let config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
  **/
  if(TEST) {
    config.entry = {};
  } else {
    config.entry = {
      app: './client/app/app.js',
      polyfills: './client/polyfills.js',
      vendor: [
        'angular',
        'angular-aria',
        // 'angular-animate',
        'angular-cookies',
        'angular-resource',
        'angular-messages',
        'angular-sanitize',
        'angular-ui-bootstrap',
        'angular-ui-router',
        'lodash'
      ]
    };
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
  **/
  if(TEST) {
    config.output = {};
  } else {
    config.output = {
      // Absolute output directory
      path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
      //publicPath: BUILD ? '/' : `http://localhost:${env.port}/`,

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    };
  }

  // Perhaps unneeded?
  if(TEST) {
    config.resolve = {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.json']
    };
  }

/**
 * Devtool
 * Reference: http://webpack.github.io/docs/configuration.html#devtool
 * Type of sourcemap to use per build type
 */
  if(TEST) {
    config.devtool = 'inline-source-map';
  } else if(BUILD || DEV) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

/**
 * Loaders
 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
 * List: http://webpack.github.io/docs/list-of-loaders.html
 * This handles most of the magic responsible for converting modules
 */

  // config.babel = {
  //   shouldPrintComment(commentContents) {
  //     // keep `/*@ngInject*/`
  //     return /@ngInject/.test(commentContents);
  //   }
  // };

  // Initialize module
  config.module = {
    //preLoaders: [],
    rules: [
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        //exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          // babelrc: false, // use settings here
          presets: ['es2015'/*, {modules: false}*/],
          plugins: [/*'transform-runtime', */'transform-class-properties'], // add 'instanbul-instrumenter-loader' if TEST
          shouldPrintComment: commentContents => /@ngInject/.test(commentContents) // leave ng-annotate alone
        },
        include: [
          path.resolve(__dirname, 'client/'),
          path.resolve(__dirname, 'node_modules/lodash-es/')
        ]
      },
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([?]?.*)$/,
        loader: 'file-loader'
      },
      // {
      //   // JSON LOADER
      //   test: /\.json$/,
      //   loader: 'json-loader'
      // },
      {
        // Pug HTML LOADER
        // Reference: https://github.com/willyelm/pug-html-loader
        // Allow loading Pug throw js
        test: /\.pug$/,
        loader: 'pug-html-loader'
      },
      {
        // CSS LOADER
        // Reference: https://github.com/webpack/css-loader
        // Allow loading css through js
        //
        // Reference: https://github.com/postcss/postcss-loader
        // Postprocess your css with PostCSS plugins
        test: /\.css$/,
        use: !TEST
          // Reference: https://github.com/webpack/extract-text-webpack-plugin
          // Put CSS into separate bundles since these can load asynchronously with JS
          //
          // Reference: https://github.com/webpack/style-loader
          // Use style-loader in development for hot-loading
          ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader'] })
          // ? ExtractTextPlugin.extract({fallback: 'style-loader',
          //   use: [
          //     { loader: 'css-loader' },
          //     { loader: 'postcss-loader',
          //       options: {
          //         plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
          //       }
          //     }
          //   ]})
          // Reference: https://github.com/webpack/null-loader
          // Skip loading css in test mode
          : 'null-loader'
      },
      {
        // SASS LOADER
        // Reference: https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        // use: [
        //   {loader: 'style-loader'},
        //   {loader: 'css-loader'},
        //   {loader: 'sass-loader',
        //     options: {
        //       outputStyle: 'compressed',
        //       precision: 10
        //       //,sourceComments: false // alread the default value
        //     }
        //   }],
        include: [
          path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
          path.resolve(__dirname, 'client/app/app.scss')
        ]
      },
      {
        enforce: 'post',
        test: /\.js$/,
        loader: 'ng-annotate-loader?single_quotes'
      }
    ]
  };

  // config.module.postLoaders = [{
  //   test: /\.js$/,
  //   loader: 'ng-annotate-loader?single_quotes'
  // }];

  // REMOVE ISPARTA-LOADER!
  // ISTANBUL-INSTRUMENTER LOADER
  // Reference: https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and spec files
  if(TEST) {
    config.module.rules.push({
      //delays coverage til after tests are run, fixing transpiled source coverage error
      enforce: 'pre',
      test: /\.js$/,
      exclude: /(node_modules|spec\.js|mock\.js)/,
      //loader: 'istanbul-instrumenter-loader',
      loader: 'isparta-loader',
      query: {
        babel: {
          // optional: ['runtime', 'es7.classProperties', 'es7.decorators']
        }
      }
    });
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer
   * Add vendor prefixes to your css
  **/
  // config.postcss = [
  //   autoprefixer({
  //     browsers: ['last 2 versions']
  //   })
  // ];

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: '[name].[hash].css', disable: !BUILD || TEST }),

    new webpack.LoaderOptionsPlugin({
      // options: { context: __dirname }, // not in Webpack 1.1
      // PostCSS (https://github.com/postcss/postcss) and Autoprefixer (https://github.com/postcss/autoprefixer)
      // Add browser-specific prefixes to CSS
      postcss: [
        autoprefixer({
          browsers: ['last 2 versions']
        })
      ],
      sassLoader: {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
      },
      babel: {
        shouldPrintComment(commentContents) {
          // keep `/*@ngInject*/`
          return /@ngInject/.test(commentContents);
        }
      }
    })
  ];

  if(!TEST) {
    config.plugins.push(new CommonsChunkPlugin({
      name: 'vendor', // filename 'vendor.js'
      minChunks: Infinity // prevents other modules from going into this chunk
    }));

    // Skips rendering index.html in test
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true
      }),
      new HtmlWebpackHarddiskPlugin()
    );
  }

  // Add build specific plugins
  if(BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      //new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        //sourceMap: true,
        output: {
          comments: false
        },
        compress: { // Don't need this as it's a default
          warnings: false
        }
      }),

      // Shrinks the size a bit (to be removed in Webpack 3)
      // new webpack.LoaderOptionsPlugin({
      //   minimize: true
      // }),

      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    );
  }

  if(DEV) {
    config.plugins.push(
       // Exchanges, adds, or removes modules while an application is running without a page reload.
      //new webpack.HotModuleReplacementPlugin(),
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      })
    );
  }

  config.cache = DEV;

  if(TEST) {
    config.stats = {
      colors: true,
      reasons: true
    };
    config.debug = false;
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './client/',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  config.node = {
    global: true, // 'window', // can be commented
    process: true, // can be commented
    crypto: 'empty', // needed by braintree-web so not false (not sure what empty means)
    clearImmediate: false,
    setImmediate: false
  };

  // Show the full Webpack config object
  console.log('Webpack Configuration:', util.inspect(config, { showHidden: false, depth: null }));

  return config;
};
