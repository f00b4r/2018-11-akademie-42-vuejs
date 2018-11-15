// Node
const path = require('path');

// Webpack
const webpack = require("webpack");
const merge = require('webpack-merge');

// Webpack plugins
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const {VueLoaderPlugin} = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackAssetsManifest = require('webpack-assets-manifest');

// Webpack abilities
const WEBPACK_DEV_SERVER_HOST = process.env.WEBPACK_DEV_SERVER_HOST || 'localhost';
const WEBPACK_DEV_SERVER_PORT = parseInt(process.env.WEBPACK_DEV_SERVER_PORT, 10) || 8080;
const WEBPACK_DEV_SERVER_PROXY_HOST = process.env.WEBPACK_DEV_SERVER_PROXY_HOST || 'localhost';
const WEBPACK_DEV_SERVER_PROXY_PORT = parseInt(process.env.WEBPACK_DEV_SERVER_PROXY_PORT, 10) || 8000;

// Config
const ROOT_PATH = __dirname;
const CACHE_PATH = __dirname + '/temp/webpack';
const VUE_VERSION = require('vue/package.json').version;
const VUE_LOADER_VERSION = require('vue-loader/package.json').version;
const devMode = process.env.NODE_ENV !== 'production';


// *********************
// WEBPACK BASE CONFIG *
// *********************

module.exports = {
    mode: devMode ? 'development' : 'production',
    context: path.join(ROOT_PATH, '/assets'),
    entry: {
        front: path.join(ROOT_PATH, 'assets/front.js'),
        admin: path.join(ROOT_PATH, 'assets/admin.js'),
    },
    output: {
        path: path.join(ROOT_PATH, 'www/dist'),
        publicPath: "/dist/",
        filename: devMode ? '[name].bundle.js' : '[name].[chunkhash:8].bundle.js',
        chunkFilename: devMode ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path => /node_modules/.test(path) && !/\.vue\.js/.test(path),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: path.join(CACHE_PATH, 'babel-loader'),
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    cacheDirectory: path.join(CACHE_PATH, 'vue-loader'),
                    cacheIdentifier: [
                        process.env.NODE_ENV || 'development',
                        webpack.version,
                        VUE_VERSION,
                        VUE_LOADER_VERSION,
                    ].join('|'),
                },
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.svg$/,
                loader: 'raw-loader',
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: 'imgs/[name].[ext]',
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(ROOT_PATH, 'assets'),
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        // enable vue-loader to use existing loader rules for other module types
        new VueLoaderPlugin(),

        // fix legacy jQuery plugins which depend on globals
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery",
            'window.$': "jquery",
            Popper: ["popper.js", "default"],
        }),

        // extract css
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].bundle.css' : '[name].[chunkhash:8].bundle.css',
        }),

        // generates manifest for Nette
        new WebpackAssetsManifest({
            output: path.resolve(ROOT_PATH, 'temp/manifest.json'),
            writeToDisk: true,
            publicPath: true,
        }),
    ],
    devtool: '#cheap-module-eval-source-map',
    performance: {
        hints: false
    },
};


// ****************************
// WEBPACK DEVELOPMENT CONFIG *
// ****************************

if (process.env.NODE_ENV === 'development') {
    const development = {
        devServer: {
            host: WEBPACK_DEV_SERVER_HOST,
            port: WEBPACK_DEV_SERVER_PORT,
            disableHostCheck: true,
            contentBase: path.join(ROOT_PATH, 'www'),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
            stats: 'errors-only',
            hot: true,
            inline: true,
            proxy: {
                '/': `http://${WEBPACK_DEV_SERVER_PROXY_HOST}:${WEBPACK_DEV_SERVER_PROXY_PORT}`
            }
        },
    };

    module.exports = merge(module.exports, development);
}


// ***************************
// WEBPACK PRODUCTION CONFIG *
// ***************************

if (process.env.NODE_ENV === 'production') {
    const production = {
        devtool: 'source-map',
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        cache: `${CACHE_PATH}/webpack/terser`,
                        parallel: true,
                        ecma: 8,
                        warnings: false,
                        parse: {},
                        compress: {},
                        mangle: true, // Note `mangle.properties` is `false` by default.
                        module: false,
                        output: null,
                        toplevel: false,
                        nameCache: null,
                        ie8: false,
                        keep_classnames: undefined,
                        keep_fnames: false,
                        safari10: false
                    }
                })
            ]
        },
        plugins: [
            // optimize CSS files
            new OptimizeCSSAssetsPlugin(),
        ],
    };

    module.exports = merge(module.exports, production);
}


// ************************
// WEBPACK OPT-INS CONFIG *
// ************************

if (process.env.WEBPACK_REPORT === '1') {
    module.exports.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
        })
    );
}