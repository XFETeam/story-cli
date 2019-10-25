// const path = require('path');
// const webpack = require('webpack');
// const resolve = relativePath => path.resolve(__dirname, relativePath);
//
// console.log('webpack; /////////////////////////////')
//
// module.exports = {
//   resolve: {
//     extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
//
//   },
//   module: {
//     rules: [
//       {
//         oneOf: [
//           {
//             test: /\.less$/,
//             use: [
//               {
//                 loader: 'style-loader'
//               },
//               {
//                 loader: 'css-loader',
//                 options: {
//                   importLoaders: 1,
//                   modules: true,
//                   // localIdentName: '[path][name]__[local]--[hash:base64:5]'
//                 }
//               },
//               {
//                 loader: 'less-loader',
//                 options: {
//                   javascriptEnabled: true
//                 }
//               },
//             ],
//             include: [
//               resolve('../src')
//             ]
//           },
//           {
//             test: /\.less$/,
//             use: [
//               {
//                 loader: 'style-loader'
//               },
//               {
//                 loader: 'css-loader',
//               },
//               {
//                 loader: 'less-loader',
//                 options: {
//                   javascriptEnabled: true
//                 }
//               }
//             ]
//           },
//           {
//             test: /\.css$/,
//             use: [
//               {
//                 loader: 'style-loader'
//               },
//               {
//                 loader: 'css-loader',
//               },
//               {
//                 loader: 'less-loader',
//                 options: {
//                   javascriptEnabled: true
//                 }
//               }
//             ],
//             // include: []
//           },
//           {
//             test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
//             use: 'url-loader'
//           },
//           {
//             test: (filename)=> {
//               if(filename.indexOf('/untitled47/src')>-1) {
//                 console.log('===============================');
//                 console.log(filename);
//                 console.log('===============================');
//               }
//               return /\.js$/.test(filename);
//             },
//             use: 'babel-loader',
//             include: /./igm
//           }
//         ]
//       }
//     ],
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       'DEPLOY_ENV': JSON.stringify('development')
//     })
//   ]
// };

const path = require('path');
console.log(path.resolve(__dirname, 'stories-helper/story-layout'));
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    Object.assign(config, {
        resolve: {
            alias: {
                '@storyLayout': path.resolve(__dirname, 'stories-helper/'),
                // '@root': path.resolve(__dirname, '../../untitled199')
            }
        },
    });
    config.module.rules[0].include = undefined;

    // config.module.rules[0].exclude = undefined;
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
            // if (/[\\\/]src[\\\/]/.test(filename)) {
            //     console.log(filename);
            // }
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
                    // localIdentName: '[path][name]__[local]--[hash:base64:5]'
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
