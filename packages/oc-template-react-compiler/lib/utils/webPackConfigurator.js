const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

// TODO: group reused settings together
// If needed rely on weboack.merge project
module.exports = function webpackConfigGenerator(options) {
  const buildPath = options.buildPath || "/build";
  const localIdentName = "oc-[path][name]___[local]___[hash:base64:5]";

  const cssLoader = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
            localIdentName
          }
        }
      ]
    })
  };

  if (options.confTarget === "view") {
    return {
      entry: options.viewPath,
      output: {
        library: options.componentName,
        path: buildPath,
        filename: options.publishFileName
      },
      externals: options.externals,
      module: {
        rules: [
          cssLoader,
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true,
                  presets: ["babel-preset-es2015", "babel-preset-react"].map(
                    require.resolve
                  ),
                  plugins: ["babel-plugin-transform-object-rest-spread"].map(
                    require.resolve
                  )
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "[name].css",
          allChunks: true
        }),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new MinifyPlugin()
      ]
    };
  } else {
    return {
      entry: options.serverPath,
      target: "node",
      output: {
        path: buildPath,
        filename: options.publishFileName,
        libraryTarget: "commonjs2"
      },
      module: {
        rules: [
          cssLoader,
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve("infinite-loop-loader")
              },
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: true,
                  presets: [
                    [
                      require.resolve("babel-preset-env"),
                      {
                        modules: false,
                        targets: {
                          node: 6
                        }
                      }
                    ],
                    require.resolve("babel-preset-react")
                  ],
                  plugins: ["babel-plugin-transform-object-rest-spread"].map(
                    require.resolve
                  )
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "[name].css",
          allChunks: true
        }),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        })
        // TODO: enable plugins only when env = production
        // new MinifyPlugin()
      ],
      logger: options.logger || console,
      stats: options.stats,
      resolve: {
        alias: {
          react: path.join(__dirname, "../../node_modules/react"),
          "react-dom": path.join(__dirname, "../../node_modules/react-dom")
        }
      }
    };
  }
};
