// Copyright 2021 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// "use strict";

globalThis.require = require;
globalThis.fs = require("fs");
globalThis.TextEncoder = require("util").TextEncoder;
globalThis.TextDecoder = require("util").TextDecoder;

globalThis.performance = {
  now() {
    const [sec, nsec] = process.hrtime();
    return sec * 1000 + nsec / 1000000;
  },
};

const crypto = require("crypto");
const path = require("path")
globalThis.crypto = {
  getRandomValues(b) {
    crypto.randomFillSync(b);
  },
};


require("./wasm_exec.cjs");

// js端加载Go编写的wasm文件
async function loadWasmOfGo(wasmPath) {
  const go = new Go();
  go.argv = [wasmPath];
  let env = Object.assign({ TMPDIR: require("os").tmpdir() }, process.env);

  for(let k in env){
    if(k.toLowerCase()=="path"){
      delete env[k]
      break
    }
  }
  go.env = env

  go.exit = process.exit;

  const wasmData = fs.readFileSync(path.join(__dirname, wasmPath));

  const { instance } = await WebAssembly.instantiate(wasmData, go.importObject);
  go.run(instance);

  // 等待 Go 代码设置 __bWasmLoaded ，设置方式：js.Global().Set("__bWasmLoaded", js.ValueOf(true))
  while (globalThis.__bWasmLoaded!==true) {
      await new Promise(resolve => setTimeout(resolve, 10));
  }
}

module.exports = {loadWasmOfGo}
// 使用方式 
//import {loadWasmOfGo} from './go_init.cjs';