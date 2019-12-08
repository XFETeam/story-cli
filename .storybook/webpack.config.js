const DoneCallbackPlugin = require('../src/done-callback-plugin');

const webpack = require('webpack');
const path = require('path');

// noinspection JSUnresolvedVariable
const { constants, alias } = global.XFE_CONFIG || {};

const constantsCloned = { ...constants };

Object.keys(constantsCloned).forEach(key => {
    constantsCloned[key] = JSON.stringify(constantsCloned[key]);
});

module.exports = async ({ config }) => {
    Object.assign(config, {
        resolve: {
            alias
        },
    });
    config.module.rules[0].include = undefined;

    config.plugins[1] = new webpack.DefinePlugin(constantsCloned);

    config.plugins.push(new DoneCallbackPlugin());

    config.module.rules[0].use[0].loader = require.resolve('babel-loader');
    config.module.rules[0].use[0].options.plugins = [
        [
            "babel-plugin-import",
            {
                "libraryName": "antd-mobile",
                "style": true
            },
            "antd-mobile"
        ]
    ];
    config.module.rules[0].use[0].options.presets = [require.resolve("@xfe-team/babel-preset-xfe")];

    config.module.rules[1].use = [
        {
            loader: 'raw-loader'
        }
    ];

    config.module.rules.push({
        test: /\.less$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    modules: true,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    config: {
                        path: path.resolve(__dirname, '../')
                    }
                }
            },
            {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            },
        ],
        exclude: /node_modules/
    });

    config.module.rules.push({
        test: /\.less$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
            },
            {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            }
        ],
        include: /node_modules/
    });

    // Return the altered config
    return config;
};
