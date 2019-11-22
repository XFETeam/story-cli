const webpack = require('webpack');
const path = require('path');

module.exports = async ({ config, mode }) => {
    Object.assign(config, {
        resolve: {
            alias: {
                '@src': process.env.STORYBOOK_WATCH_DIR,
                'react': path.resolve(process.cwd(), 'node_modules', 'react'),
                'react-dom': path.resolve(process.cwd(), 'node_modules', 'react-dom')
            }
        },
    });
    config.module.rules[0].include = undefined;

    config.plugins[1] = new webpack.DefinePlugin({
        DEPLOY_ENV: JSON.stringify('test')
    });
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
