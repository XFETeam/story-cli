#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const { version } = require('../package.json');
// process.env.SBCONFIG_CONFIG_DIR = path.resolve(__dirname, '../.storybook');
process.env.ORIGINAL_CWD = process.cwd();
process.chdir(path.resolve(__dirname, '../'));

(() => {
    /**
     * 定义当前命令版本
     */
    program
        .version(version);
    /**
     * 禁止自动安装
     */
    program
        .option('-p, --port', 'story book')
        .option('-c, --config-dir <path>', '设置配置文件路径, 默认路径为 webpack.config.js, 对于复杂需求可以用于区分多个不同的环境');


    /**
     * 核心模块, 进入开发环境
     */
    // process.env.SBCONFIG_PORT = 9998;
    // require('@storybook/react/bin/index.js');
    (() => {
        program
            .command('start')
            .alias('s')
            .action((env) => {
                if (program.port) {
                    process.env.SBCONFIG_PORT = program.port;
                }
                if (program.configDir) {
                    process.env.SBCONFIG_CONFIG_DIR = program.configDir;
                }
                // console.log(program.configDir);
                // console.log(path.resolve(__dirname, '../.storybook/config.js'));
                // console.log(process.cwd());
                // process.env.SBCONFIG_CONFIG_DIR = path.resolve(__dirname, '../.storybook/config.js');
                // console.log('SBCONFIG_CONFIG_DIR: ' + cwd);
                require('@storybook/react/bin/index.js');
            });
    })();
    /**
     * 当命令参数为空的时候提示用户
     */
    if (!process.argv.slice(2).length) {
        program.outputHelp();
        return;
    }
    /**
     * 解析命令
     */
    program.parse(process.argv);
})();
//# sourceMappingURL=index.js.map
