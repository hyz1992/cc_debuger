"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetHandlers = exports.configs = exports.unload = exports.load = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const PACKAGE_NAME = 'cc_debuger_realtime';
let _wsDefault = "ws://localhost:8085";
const load = function () {
    var _a;
    const jsonCfgPath = Editor.Package.getPath(PACKAGE_NAME) + "/cache/localServer.json";
    if (fs_extra_1.default.existsSync(jsonCfgPath)) {
        let obj = null;
        try {
            obj = fs_extra_1.default.readJSONSync(jsonCfgPath);
        }
        catch (e) {
        }
        if (obj == null) {
            return;
        }
        let _opts = exports.configs;
        _opts = (_a = _opts["*"]) === null || _a === void 0 ? void 0 : _a.options;
        let addressUrl = null;
        if ((obj === null || obj === void 0 ? void 0 : obj.ip) && (obj === null || obj === void 0 ? void 0 : obj.port)) { //默认连接本机服务器
            addressUrl = `ws://${obj.ip}:${obj.port}`;
        }
        if (addressUrl) {
            _wsDefault = obj.ws;
            if (_opts === null || _opts === void 0 ? void 0 : _opts.serverAddress) {
                _opts.serverAddress.default = obj.ws;
            }
        }
    }
};
exports.load = load;
const unload = function () {
    console.debug(`${PACKAGE_NAME} unload`);
};
exports.unload = unload;
exports.configs = {
    '*': {
        hooks: './hooks',
        doc: 'editor/publish/custom-build-plugin.html',
        options: {
            cut_plugin_from_runtime: {
                label: `是否剔除cc_debuger`,
                description: "是否从assets中剔除相关插件代码，如在publish版本中不需要调试功能，可勾选此选项",
                default: false,
                render: {
                    ui: 'ui-checkbox',
                },
            },
            bAutoStarPlugin: {
                label: `是否自动连接插件`,
                default: true,
                description: "（未剔除情况下有意义）启动app后，是否自动连接cc_debuger插件，不勾选的话，则由app自择合适时机来连接",
                render: {
                    ui: 'ui-checkbox',
                },
            },
            serverAddress: {
                label: `中转服务器地址`,
                default: _wsDefault,
                description: "（未剔除情况下有意义）",
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: '',
                    },
                },
                verifyRules: ['required', 'wsServerUrl'],
            },
        },
        verifyRuleMap: {
            ruleTest: {
                message: `i18n:${PACKAGE_NAME}.options.ruleTest_msg`,
                func(val, buildOptions) {
                    if (val === 'cocos') {
                        return true;
                    }
                    return false;
                },
            },
            wsServerUrl: {
                message: "必须填写有效的websocket地址,以 'ws://' 或 'wss://' 开头",
                func(val, buildOptions) {
                    if (val.startsWith("ws://") || val.startsWith("wss://")) {
                        return true;
                    }
                    return false;
                },
            }
        },
    },
};
exports.assetHandlers = './asset-handlers';
