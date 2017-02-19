/* eslint-env node */
'use strict';

import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

module.exports = function makeWebpackConfig(options) {
  // DEV, TEST, and BUILD are set in webpack.<env>.js
  // E2E set by gulpfile, else undefined
  let DEV = !!options.DEV;
  let TEST = !!options.TEST;
  let BUILD = !!options.BUILD;
  let E2E = !!options.E2E;

  let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

  let config = {};

  if(TEST) {
    config.entry = {};
  } else {
    // split app and vendor code to promote fast loading
    config.entry = {
      app: './client/app/app.js',
      polyfills: './client/polyfills.js',
      vendor: [
        'lodash'
      ]
    };
  }

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

  // config.resolve removed because defaults were useds

  if(TEST) {
    config.devtool = 'inline-source-map';
  } else if(BUILD || DEV) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

  config.babel = {
    shouldPrintComment(commentContents) {
      // keep `/*@ngInject*/`
      return /@ngInject/.test(commentContents);
    }
  };

  // Initialize module
  config.module = {
    noParse: [
      path.join(__dirname, 'node_modules', 'zone.js', 'dist'),
      path.join(__dirname, 'node_modules', '@angular', 'bundles'),
    ],
    rules: [
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        use: {
          loader: 'babel',
          options: {
            plugins: TEST ? ['istanbul'] : [],
          }
        },
        include: [
          path.resolve(__dirname, 'client/'),
          path.resolve(__dirname, 'server/config/environment/shared.js'),
          path.resolve(__dirname, 'node_modules/lodash-es/'),
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
          // Extract css files in production builds
          //
          // Reference: https://github.com/webpack/style-loader
          // Use style-loader in development for hot-loading
          //? ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
          //? ExtractTextPlugin.extract('style-loader', 'css!postcss-loader')
          ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [autoprefixer({browsers: ['last 2 version']})]
                }
              }
            ]
          })
          // See http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/ re: Webpack 2
          // Reference: https://github.com/webpack/null-loader
          // Skip loading css in test mode
          : 'null'
      },
      {
        // SASS LOADER
        // Reference: https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        use: ['raw',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'compressed',
              precision: 10,
              sourceComments: false
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
          path.resolve(__dirname, 'client')
        ]
      },
/*
      {
        test: /(\.css|\.scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer({browsers: ['last 2 version']})]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
              }
            }
          ]
        })
      },
*/
      {
        enforce: 'post',
        test: /\.js$/,
        loader: 'ng-annotate?single_quotes'
      }
    ]
  };

  // ISPARTA LOADER
  // Reference: https://github.com/deepsweet/isparta-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and spec files
  if(TEST) {
    config.module.rules.push({
      //delays coverage til after tests are run, fixing transpiled source coverage error
      enforce: 'pre',
      test: /\.js$/,
      exclude: /(node_modules|spec\.js|mock\.js)/,
      loader: 'isparta-loader',
      query: {
        babel: {
          // optional: ['runtime', 'es7.classProperties', 'es7.decorators']
        }
      }
    });
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('[name].[hash].css', {
      disable: !BUILD || TEST
    })
  ];

  if(!TEST) {
    config.plugins.push(new CommonsChunkPlugin({
      name: 'vendor', // filename: "vendor.js"
      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }));
  }

  // Skip rendering index.html in test mode
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  if(!TEST) {
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
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourceMap: true,
        output: {
          comments: false
        }
      }),

      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),

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
    global: 'window',
    process: true,
    crypto: 'empty',
    clearImmediate: false,
    setImmediate: false
  };

  return config;
};
