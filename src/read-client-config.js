const fs = require('fs');
const util = require('util');
const path = require('path');
const access = util.promisify(fs.access);

/**
 * 读取客户端配置
 */
async function readClientConfig(cwd = process.cwd()) {
    const targetConfigFilePath = path.resolve(cwd, '.xfe-story/config.js');
    const isExist = await access(targetConfigFilePath).then(() => {
        return true;
    }).catch((err) => {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    });
    if (isExist) {
        return require(targetConfigFilePath);
    }
    return null;
}

module.exports = readClientConfig;
