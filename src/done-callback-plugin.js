class DoneCallbackPlugin {
    apply(compiler) {
        compiler.plugin('done', compilation => {
            if (!compilation.hasErrors()) {
                // noinspection JSUnresolvedFunction,JSUnresolvedVariable
                global.DISPLAY_SERVER_STARTUP_INFO && global.DISPLAY_SERVER_STARTUP_INFO();
            }
        });
    }
}

module.exports = DoneCallbackPlugin;
