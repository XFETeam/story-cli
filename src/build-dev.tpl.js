"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildDevStandalone = buildDevStandalone;
exports.buildDev = buildDev;

var _express = _interopRequireDefault(require("express"));

var _https = _interopRequireDefault(require("https"));

var _http = _interopRequireDefault(require("http"));

var _ip = _interopRequireDefault(require("ip"));

var _serveFavicon = _interopRequireDefault(require("serve-favicon"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _chalk = _interopRequireDefault(require("chalk"));

var _nodeLogger = require("@storybook/node-logger");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _fileSystemCache = _interopRequireDefault(require("file-system-cache"));

var _findCacheDir = _interopRequireDefault(require("find-cache-dir"));

var _open = _interopRequireDefault(require("open"));

var _boxen = _interopRequireDefault(require("boxen"));

var _semver = _interopRequireDefault(require("semver"));

var _commonTags = require("common-tags");

var _cliTable = _interopRequireDefault(require("cli-table3"));

var _prettyHrtime = _interopRequireDefault(require("pretty-hrtime"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _detectPort = _interopRequireDefault(require("detect-port"));

var _devServer = _interopRequireDefault(require("./dev-server"));

var _cli = require("./cli");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function (key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

const defaultFavIcon = require.resolve('./public/favicon.ico');

const cacheDir = (0, _findCacheDir.default)({
    name: 'storybook'
});
const cache = (0, _fileSystemCache.default)({
    basePath: cacheDir,
    ns: 'storybook' // Optional. A grouping namespace for items.

});

const writeStats = async (name, stats) => {
    await _fsExtra.default.writeFile(_path.default.join(cacheDir, `${name}-stats.json`), JSON.stringify(stats.toJson(), null, 2), 'utf8');
};

const getFreePort = port => (0, _detectPort.default)(port).catch(error => {
    _nodeLogger.logger.error(error);

    process.exit(-1);
});

async function getServer(app, options) {
    if (!options.https) {
        return _http.default.createServer(app);
    }

    if (!options.sslCert) {
        _nodeLogger.logger.error('Error: --ssl-cert is required with --https');

        process.exit(-1);
    }

    if (!options.sslKey) {
        _nodeLogger.logger.error('Error: --ssl-key is required with --https');

        process.exit(-1);
    }

    const sslOptions = {
        ca: await Promise.all((options.sslCa || []).map(ca => _fsExtra.default.readFile(ca, 'utf-8'))),
        cert: await _fsExtra.default.readFile(options.sslCert, 'utf-8'),
        key: await _fsExtra.default.readFile(options.sslKey, 'utf-8')
    };
    return _https.default.createServer(sslOptions, app);
}

async function applyStatic(app, options) {
    const {
        staticDir
    } = options;
    let hasCustomFavicon = false;

    if (staticDir && staticDir.length) {
        await Promise.all(staticDir.map(async dir => {
            const staticPath = _path.default.resolve(dir);

            if (await !_fsExtra.default.exists(staticPath)) {
                _nodeLogger.logger.error(`Error: no such directory to load static files: ${staticPath}`);

                process.exit(-1);
            }

            _nodeLogger.logger.info(`=> Loading static files from: ${staticPath} .`);

            app.use(_express.default.static(staticPath, {
                index: false
            }));

            const faviconPath = _path.default.resolve(staticPath, 'favicon.ico');

            if (await _fsExtra.default.exists(faviconPath)) {
                hasCustomFavicon = true;
                app.use((0, _serveFavicon.default)(faviconPath));
            }
        }));
    }

    if (!hasCustomFavicon) {
        app.use((0, _serveFavicon.default)(defaultFavIcon));
    }
}

const updateCheck = async version => {
    let result;
    const time = Date.now();

    try {
        const fromCache = await cache.get('lastUpdateCheck', {
            success: false,
            time: 0
        }); // if last check was more then 24h ago

        if (time - 86400000 > fromCache.time) {
            const fromFetch = await Promise.race([
                (0, _nodeFetch.default)(`https://storybook.js.org/versions.json?current=${version}`), // if fetch is too slow, we won't wait for it
                new Promise((res, rej) => global.setTimeout(rej, 1500))
            ]);
            const data = await fromFetch.json();
            result = {
                success: true,
                data,
                time
            };
            await cache.set('lastUpdateCheck', result);
        } else {
            result = fromCache;
        }
    } catch (error) {
        result = {
            success: false,
            error,
            time
        };
    }

    return result;
};

function listenToServer(server, listenAddr) {
    let serverResolve = () => {
    };

    let serverReject = () => {
    };

    const serverListening = new Promise((resolve, reject) => {
        serverResolve = resolve;
        serverReject = reject;
    });
    server.listen(...listenAddr, error => {
        if (error) {
            serverReject(error);
        } else {
            serverResolve();
        }
    });
    return serverListening;
}

function createUpdateMessage(updateInfo, version) {
    let updateMessage;

    try {
        updateMessage = updateInfo.success && _semver.default.lt(version, updateInfo.data.latest.version) ? _commonTags.stripIndents`
          ${_nodeLogger.colors.orange(`A new version (${_chalk.default.bold(updateInfo.data.latest.version)}) is available!`)}

          ${_chalk.default.gray('Read full changelog here:')} ${_chalk.default.gray.underline('https://git.io/fhFYe')}
        ` : '';
    } catch (e) {
        updateMessage = '';
    }

    return updateMessage;
}

function outputStartupInformation(options) {
    const {
        updateInfo,
        version,
        address,
        networkAddress,
        managerTotalTime,
        previewTotalTime
    } = options;
    const updateMessage = createUpdateMessage(updateInfo, version);
    const serveMessage = new _cliTable.default({
        chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: ''
        },
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0
    });
    serveMessage.push(['Local:', _chalk.default.cyan(address)], [
        'On your network:',
        _chalk.default.cyan(networkAddress)
    ]);
    const timeStatement = previewTotalTime ? `${_chalk.default.underline((0, _prettyHrtime.default)(managerTotalTime))} for manager and ${_chalk.default.underline((0, _prettyHrtime.default)(previewTotalTime))} for preview` : `${_chalk.default.underline((0, _prettyHrtime.default)(managerTotalTime))}`; // eslint-disable-next-line no-console

    global.DISPLAY_SERVER_STARTUP_INFO = function () {
        console.log((0, _boxen.default)(_commonTags.stripIndents`
          ${_nodeLogger.colors.green(`Storybook ${_chalk.default.bold(version)} started`)}
          ${_chalk.default.gray(timeStatement)}

          ${serveMessage.toString()}${updateMessage ? `\n\n${updateMessage}` : ''}
        `, {
            borderStyle: 'round',
            padding: 1,
            borderColor: '#F1618C'
        }));
    };

    global.DISPLAY_SERVER_STARTUP_INFO();
}

async function outputStats(previewStats, managerStats) {
    if (previewStats) {
        await writeStats('preview', previewStats);
    }

    await writeStats('manager', managerStats);

    _nodeLogger.logger.info(`stats written to => ${_chalk.default.cyan(_path.default.join(cacheDir, '[name].json'))}`);
}

function openInBrowser(address) {
    (0, _open.default)(address).catch(() => {
        _nodeLogger.logger.error(_commonTags.stripIndents`
      Could not open ${address} inside a browser. If you're running this command inside a
      docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
      browser by default.
    `);
    });
}

async function buildDevStandalone(options) {
    try {
        const {
            host,
            extendServer
        } = options;
        const port = await getFreePort(options.port);

        if (!options.ci && !options.smokeTest && options.port != null && port !== options.port) {
            const {
                shouldChangePort
            } = await _inquirer.default.prompt({
                type: 'confirm',
                default: true,
                name: 'shouldChangePort',
                message: `Port ${options.port} is not available. Would you like to run Storybook on port ${port} instead?`
            });

            if (!shouldChangePort) {
                process.exit(1);
            }
        } // Used with `app.listen` below


        const listenAddr = [port];

        if (host) {
            listenAddr.push(host);
        }

        const app = (0, _express.default)();
        const server = await getServer(app, options);

        if (typeof extendServer === 'function') {
            extendServer(server);
        }

        await applyStatic(app, options);
        const {
            router: storybookMiddleware,
            previewStats,
            managerStats,
            managerTotalTime,
            previewTotalTime
        } = await (0, _devServer.default)(options);
        app.use(storybookMiddleware);
        const serverListening = listenToServer(server, listenAddr);
        const {
            version
        } = options.packageJson;
        const [updateInfo] = await Promise.all([updateCheck(version), serverListening]);
        const proto = options.https ? 'https' : 'http';
        const address = `${proto}://${options.host || 'localhost'}:${port}/`;
        const networkAddress = `${proto}://${_ip.default.address()}:${port}/`;
        outputStartupInformation({
            updateInfo,
            version,
            address,
            networkAddress,
            managerTotalTime,
            previewTotalTime
        });

        if (options.smokeTest) {
            await outputStats(previewStats, managerStats);
            let warning = 0;

            if (!options.ignorePreview) {
                warning += previewStats.toJson().warnings.length;
            }

            warning += managerStats.toJson().warnings.length;
            process.exit(warning ? 1 : 0);
        } else if (!options.ci) {
            openInBrowser(address);
        }
    } catch (error) {
        // this is a weird bugfix, somehow 'node-pre-gyp' is poluting the npmLog header
        _nodeLogger.instance.heading = '';

        _nodeLogger.logger.line();

        _nodeLogger.logger.warn(error.close ? _commonTags.stripIndents`
            FATAL broken build!, will close the process,
            Fix the error below and restart storybook.
          ` : _commonTags.stripIndents`
            Broken build, fix the error below.
            You may need to refresh the browser.
          `);

        _nodeLogger.logger.line();

        if (error instanceof Error) {
            if (error.error) {
                _nodeLogger.logger.error(error.error);
            } else if (error.stats && error.stats.compilation.errors) {
                error.stats.compilation.errors.forEach(e => _nodeLogger.logger.plain(e));
            } else {
                _nodeLogger.logger.error(error);
            }

            if (error.close) {
                process.exit(1);
            }
        }

        if (options.smokeTest) {
            process.exit(1);
        }
    }
}

async function buildDev(_ref) {
    let {
            packageJson
        } = _ref,
        loadOptions = _objectWithoutProperties(_ref, ["packageJson"]);

    const cliOptions = await (0, _cli.getDevCli)(packageJson);
    await buildDevStandalone(_objectSpread({}, cliOptions, loadOptions, {
        packageJson,
        configDir: loadOptions.configDir || cliOptions.configDir || './.storybook'
    }));
}
