const webpack = require('webpack');

module.exports = async ({ config, mode }) => {
    console.log('process.env.STORYBOOK_WATCH_DIR: ' + process.env.STORYBOOK_WATCH_DIR);
    console.log('process.cwd: ' + process.cwd());
    Object.assign(config, {
        resolve: {
            alias: {
                '@src': process.env.STORYBOOK_WATCH_DIR,
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
    config.module.rules[0].use[0].options.presets = [require.resolve("babel-preset-umi")];

    config.module.rules.push({
        test: (filename) => {
            if (/\.less$/.test(filename)) {
                console.log(filename);
            }
            return /\.less$/.test(filename);
        },
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
