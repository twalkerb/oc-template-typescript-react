"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const resolve = require("resolve");
const _ = require("lodash");

const createExcludeRegex = require("../createExcludeRegex");

module.exports = options => {
  const buildPath = options.buildPath || "/build";
  const production = options.production;
  process.env.BABEL_ENV = production ? "production" : "development";
  const skipTypecheck =
    !production && process.env.TSC_SKIP_TYPECHECK === "true";
  const buildIncludes = options.buildIncludes.concat(
    "oc-template-typescript-react-compiler/utils"
  );
  const excludeRegex = createExcludeRegex(buildIncludes);
  const localIdentName = !production
    ? "oc__[path][name]-[ext]__[local]__[hash:base64:8]"
    : "[local]__[hash:base64:8]";

  const cssLoader = {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName,
          camelCase: true
        }
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: [
            require("postcss-import"),
            require("postcss-extend"),
            require("postcss-icss-values"),
            require("autoprefixer")
          ]
        }
      }
    ]
  };

  let plugins = [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      allChunks: true,
      ignoreOrder: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      )
    })
  ];
  if (production) {
    plugins = plugins.concat(new MinifyPlugin());
  }
  if (!skipTypecheck) {
    plugins = plugins.concat(
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync("typescript", {
          basedir: path.join(options.componentPath, "node_modules")
        }),
        compilerOptions: {
          allowJs: false
        },
        async: !production,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        resolveModuleNameModule: process.versions.pnp
          ? path.join(__dirnamem, "..", pnpTs.js)
          : undefined,
        resolveTypeReferenceDirectiveModule: process.versions.pnp
          ? path.join(__dirnamem, "..", pnpTs.js)
          : undefined,
        tsconfig: path.join(options.componentPath, "tsconfig.json"),
        reportFiles: [
          "**",
          "!**/__tests__/**",
          "!**/?(*.)(spec|test).*",
          "!**/src/setupProxy.*",
          "!**/src/setupTests.*"
        ],
        silent: true
      })
    );
  }

  const polyfills = ["Object.assign"];

  return {
    mode: production ? "production" : "development",
    optimization: {
      // https://webpack.js.org/configuration/optimization/
      // Override production mode optimization for minification
      // As it currently breakes the build, still rely on babel-minify-webpack-plugin instead
      minimize: false
    },
    entry: options.viewPath,
    output: {
      path: buildPath,
      filename: options.publishFileName
    },
    externals: _.omit(options.externals, polyfills),
    module: {
      rules: [
        cssLoader,
        {
          test: /\.(t|j)sx?$/,
          exclude: excludeRegex,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve(
                  "babel-preset-react-app/webpack-overrides"
                ),
                cacheCompression: false,
                compact: !!production,
                cacheDirectory: !production,
                babelrc: false,
                configFile: false,
                presets: [require.resolve("babel-preset-react-app")]
              }
            }
          ]
        }
      ]
    },
    plugins,
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json", ".css"]
    }
  };
};
