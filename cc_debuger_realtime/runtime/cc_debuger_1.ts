
// @ts-ignore
import { DEBUG, DEV, EDITOR, JSB, PREVIEW, SUPPORT_JIT } from 'cc/env';

import * as cc from "cc"

window["__cchyz"] = cc

function isWebSocketSupported() {
    if (typeof WebSocket === 'function') {
        return true;
    }
    return false;
}


setTimeout(() => {
    if(!isWebSocketSupported()){
        console.log("cc_debugger_realtime requires websocket, but websocket is not enabled")
        return
    }
    function getGameEnv(){
        let obj = {
            isNative:cc.sys.isNative,
            isBrowser:cc.sys.isBrowser,
            isMobile:cc.sys.isMobile,
            CC_DEV: DEV,
            CC_DEBUG: DEBUG,
            CC_PREVIEW: PREVIEW,
            CC_JSB: JSB,
            CC_SUPPORT_JIT: SUPPORT_JIT,
            CC_EDITOR:EDITOR
        } as GameEnvParam 
        if(cc.sys.isNative){
            obj.writablePath = cc.native.fileUtils.getWritablePath()
        }
        return obj
    }
    window["getGameEnv"] = getGameEnv

    //是否启动app后自动连接服务器
    let bAutoStart = true;
    //中转服务器地址
    let plugin_server_address = `ws://localhost:8085`;

    window["__cc_debuger_wsUrl"] = plugin_server_address;

    if (!EDITOR&&bAutoStart) {
        cc.director.once(cc.Director.EVENT_BEFORE_SCENE_LAUNCH,()=>{
            const _initOnce = window["__cc_debuger__initOnce"]
            if(_initOnce){
                _initOnce()
            }
        })
    }
}, 100);


