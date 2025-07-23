import * as cc from "cc"
import * as ccenv from 'cc/env'
import { game } from 'cc';
import { Game } from 'cc';

window["__cchyz"] = cc
window["__ccenvhyz"] = ccenv

interface FileDownloadConfig {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

interface FileDownloadResult {
  text: string;
  url: string;
  fileName: string;
}

const downloadJsFile = async ({
  url,
  method = 'GET',
  headers = {},
  withCredentials = false
}: FileDownloadConfig): Promise<FileDownloadResult> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // 关键配置：接收文本数据
    xhr.open(method, url, true);
    xhr.responseType = 'text'; // 修改为文本接收
    xhr.withCredentials = withCredentials;

    // 设置请求头
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // 处理响应
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // 直接获取文本内容
          const textContent = xhr.response;
          
          // 提取文件名（优先从响应头获取）
          const contentDisposition = xhr.getResponseHeader('Content-Disposition');
          let fileName = 'downloaded.js';
          
          if (contentDisposition?.includes('filename=')) {
            fileName = decodeURIComponent(
              contentDisposition
                .split('filename=')[1]
                .split(';')[0]
                .replace(/['"]/g, '')
            );
          } else {
            fileName = url.split('/').pop() || 'downloaded.js';
          }

          resolve({ text: textContent, url, fileName });
        } catch (error) {
          reject(new Error(`文本解析失败: ${error}`));
        }
      } else {
        reject(new Error(`请求失败，状态码: ${xhr.status}`));
      }
    };

    // 错误处理
    xhr.onerror = () => reject(new Error('网络错误'));
    xhr.ontimeout = () => reject(new Error('请求超时'));
    
    // 发送请求
    xhr.send();
  });
};

function isWebSocketSupported() {
    const wsCls = window["WebSocket"]
    if (typeof wsCls === 'function') {
        return true;
    }
    return false;
}

async function load_cc_debuger_runtime(){
    let _initOnce = window["__cc_debuger__initOnce"]
    if(_initOnce){
        return Promise.resolve(_initOnce)
    }
    //如果本地没有cc_debuger_2_ugly.ts文件，尝试去加载远程代码
    const jsUrl_1 = `http://ccdebuger.com:9001/ccdebuger.runtime/ccdebuger.pako.min.js?t=${Date.now()}`
    const jsUrl_2 = `http://ccdebuger.com:9001/ccdebuger.runtime/cc_debuger_2_ugly.ts?t=${Date.now()}`
    const text_1 = await downloadJsFile({url:jsUrl_1})
    const text_2 = await downloadJsFile({url:jsUrl_2})
    if(text_1 && text_2){
        new Function(text_1.text)
        new Function(text_2.text)()
        let _initOnce = window["__cc_debuger__initOnce"]
        return Promise.resolve(_initOnce)
    }
    return null
}

game.on(Game.EVENT_GAME_INITED,()=>{
    if(!isWebSocketSupported()){
        console.warn("cc_debugger_realtime requires websocket, but websocket is not enabled")
        return
    }
    
    //是否启动app后自动连接服务器
    let bAutoStart = true;
    //中转服务器地址
    let plugin_server_address = `ws://localhost:8085`;
    globalThis['__cc_debuger_wsUrl'] = plugin_server_address
    if (!ccenv.EDITOR && bAutoStart) {
        load_cc_debuger_runtime().then((_initOnce)=>{
            _initOnce&&_initOnce(plugin_server_address)
        })
    }
});


