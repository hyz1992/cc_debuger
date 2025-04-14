
// @ts-ignore
import * as ccenv from 'cc/env'

import * as cc from "cc"

window["__cchyz"] = cc
window["__ccenvhyz"] = ccenv

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
    
    //是否启动app后自动连接服务器
    let bAutoStart = true;
    //中转服务器地址
    let plugin_server_address = `ws://localhost:8085`;

    window["__cc_debuger_wsUrl"] = plugin_server_address;

    if (!ccenv.EDITOR&&bAutoStart) {
        const scene = cc.director.getScene()
        if(scene){
            const _initOnce = window["__cc_debuger__initOnce"]
            if(_initOnce){
                _initOnce()
            }
        }else{
            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH,()=>{
                const _initOnce = window["__cc_debuger__initOnce"]
                if(_initOnce){
                    _initOnce()
                }
            })
        }
    }
}, 100);


