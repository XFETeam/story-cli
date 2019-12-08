#!/usr/bin/env node
// noinspection NpmUsedModulesInstalled
const program = require("commander");
const path = require('path');
const { version } = require('../package.json');
const readClientConfig = require('../src/read-client-config');

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
        .option('-p, --port [number]', '设置storybook运行的端口号')
        .option('-w, --watch-dir <path>', 'storybook监听的目录, 默认监听当前目录的src');

    /**
     * 核心模块, 进入开发环境
     */
    (() => {
        program
            .command('start')
            .alias('s')
            .description('启动')
            .action(async (env) => {
                if (path.resolve(__dirname, '../') === process.cwd() && hasEnter) {
                    return;
                }
                hasEnter = true;

                const cwd = process.cwd();
                const STORYBOOK_WATCH_DIR = path.resolve(cwd, 'src');

                if (program.watchDir) {
                    if (path.isAbsolute(program.watchDir)) {
                        process.env.STORYBOOK_WATCH_DIR = program.watchDir;
                    } else {
                        process.env.STORYBOOK_WATCH_DIR = path.resolve(cwd, program.watchDir);
                    }
                } else {
                    process.env.STORYBOOK_WATCH_DIR = STORYBOOK_WATCH_DIR;
                }

                // noinspection JSUndefinedPropertyAssignment
                global.XFE_CONFIG = await readClientConfig(path.resolve(process.env.STORYBOOK_WATCH_DIR, '../'));
                // noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
                const { story = {} } = global.XFE_CONFIG || {};
                story.port && (process.env.SBCONFIG_PORT = story.port);
                // noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
                story.watchDir && (process.env.STORYBOOK_WATCH_DIR = story.watchDir);

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
