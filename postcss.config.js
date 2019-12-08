// noinspection JSUnresolvedVariable
const { postcss = {} } = global.XFE_CONFIG || {};

const cleanUndefined = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};

module.exports = {
    plugins: cleanUndefined({
        /**
         * 修复 flex 书写中可能带来的 bug,
         * 这样有助于兼容更多浏览器
         */
        'postcss-flexbugs-fixes': {},
        /**
         * 自动加前缀
         */
        autoprefixer: {
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9', 'iOS >= 8', 'Android >= 4']
        },
        /**
         * 将指定的 px 转换成 rem,
         * 也可以通过该工具转换成 viewpoint
         */
        'postcss-px-to-viewport': postcss['postcss-px-to-viewport']
    })
};
