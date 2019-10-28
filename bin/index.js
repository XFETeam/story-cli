#!/usr/bin/env node
const program = require("commander");
const path = require('path');
const {version} = require('../package.json');

/**'
 * 存在执行两次的bug，暂时通过hasEnter变量规避
 * @type {boolean}
 */
let hasEnter = false;

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
        .option('-p, --port', '设置storybook运行的端口号')
        .option('-w, --watch-dir <path>', 'storybook监听的目录, 默认监听当前目录的src');

    /**
     * 核心模块, 进入开发环境
     */
    (() => {

        program
            .command('start')
            .alias('s')
            .description('启动')
            .action((env) => {
                if (path.resolve(__dirname, '../') === process.cwd() && hasEnter) {
                    return;
                }
                hasEnter = true;
                if (program.port) {
                    process.env.SBCONFIG_PORT = program.port;
                }
                const cwd = process.cwd();
                if (program.watchDir) {
                    if (path.isAbsolute(program.watchDir)) {
                        process.env.STORYBOOK_WATCH_DIR = program.watchDir;
                    } else {
                        process.env.STORYBOOK_WATCH_DIR = path.resolve(cwd, program.watchDir);
                    }
                } else {
                    process.env.STORYBOOK_WATCH_DIR = path.resolve(cwd, 'src');
                }
                process.chdir(path.resolve(__dirname, '../'));
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
