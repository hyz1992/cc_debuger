# cc_debuger_realtime

这是一款针对cocos程序（暂时只支持3.x）、能显著提高调试效率的工具。无论开发版还是发布版，不分Android、ios、web、小游戏，都支持包括但不限于以下功能：
- 实时查看节点树、实时修改节点或组件属性
- 实时统计节点（或递归子节点）依赖的资源列表
- 实时查看内存中的资源、引用计数、依赖情况
- 实时查看内存中的动态图集
- 支持动态注入执行js脚本，并获取返回值
- 支持拦截并显示运行时日志
- 支持查看可写目录的文件结构，并支持下载文件到PC端预览（仅native）
- 实时预览或切换spine、dragon、cc.Animation的动画
- 打开或关闭FPS预览

## 大致原理
本插件分为3个部分：
   - 插件客户端 
   - 插件中转服务器
   - 运行时客户端

其中，插件客户端即插件UI，其中包含一个Websocket客户端；运行时客户端即您的游戏本身，启用插件的时候会自动加载两个ts文件，其中也包含一个Websocket客户端；插件中转服务器的核心是使用go编译的wasm，其中包含一个Websocket服务器，用于辅助前两者之间的数据交互。

所以理论上，可以在插件UI上展现一切您的游戏运行时的信息。如果将插件服务器部署在远程，甚至可以对任意出现bug的线上客户端进行实时调试。

## 项目设置

1. **插件依赖 Websocket**：确保在项目设置的功能裁剪中，勾选了 Websocket。否则，构建后的程序将无法连接插件。

## 安装注意事项

1. **下载插件**
    - 将插件下载后，放置在 Cocos Creator 根目录下的 `extensions` 文件夹中，并命名为 `cc_debuger_realtime`。

2. **安装依赖（从Cocos Store下载的无需此步骤）**
   - 执行 `npm install` 安装所需的依赖。

3. **启用插件**
   - 打开 Cocos Creator 编辑器，进入扩展管理，启用该插件，点击刷新。
   - 插件已启用后，在编辑器菜单页找到 “扩展-节点&资源-实时调试”，点击即可打开插件主界面

   ![打开主界面](.\images\0_打开主界面.gif)


## 文件夹结构
```text
cc_debuger_realtime/
├── builder/
├── dist/
├── i18n/
├── runtime/
│   ├── cc_debuger_1.ts
│   └── cc_debuger_2_ugly.ts
├── server/
│   ├── wasm/
│   │   ├── go_init.cjs
│   │   └── wasm_exec.cjs
│   ├── server.js
│   └── server.wasm
├── package.json
└── version.txt
```

### 各文件夹作用如下：
- **builder** 干预构建流程，用于修改中转服务器地址等
- **dist** 插件UI和主要逻辑代码都在这，已混淆过
- **i18n** 多语言配置
- **runtime** 此文件夹内的两个文件，会在加载插件的时候自动复制到assets目录下，里面包含一个websocket客户端，用于与插件交互各种运行时数据，如节点树、资源使用情况、自动图集、FPS帧率、注入js代码等
- **server** 这里是插件服务器，其中server.wasm是go语言编写的服务器核心代码，此服务器作为中转，辅助插件客户端和运行时客户端(即您的游戏)进行交互。
   - 插件主界面打开的时候，会自动运行此服务器，一般情况下，地址是ws://localhost:8085
   - 您也可以手动运行服务器，只需要使用nodejs执行如下命令 npm install ws && node server.js 8888，这就会在本地的8888端口开启一个中转服务器，当您把它部署到远程，即是远程服务器，您可以在插件主界面上切换到此服务器。
- **package.json** 插件的清单配置和nodejs依赖等
- **version.txt** 记录插件的版本号


## 效果截图

### 1. 实时查看节点树
![实时查看节点树](.\images\1_节点树资源树.gif)

### 2. 实时修改节点信息
支持修改节点坐标、缩放等，也支持修改任意组件的任意信息，如color、string、label

![实时修改节点信息](.\images\2_修改节点信息.gif)

### 3. 查看节点依赖的资源列表
![查看节点依赖的资源列表](.\images\3_查看节点依赖的资源列表.gif)

### 4. 动态图集
![动态图集](.\images\4_动态图集.gif) 

### 5. 查看引用资源的节点
![查看引用资源的节点](.\images\5_查看引用资源的节点.gif) 

### 6. 执行js脚本
可以修改运行时内存的信息：
```js
const _node = scene?.getChildByPath("Canvas/loading");
_node.active = false
```
也可以获得运行时内存中的信息：
```js
const scene = cc.director.getScene();
return scene.name
```

![执行js脚本](.\images\6_执行js脚本.gif)

### 7. 拦截日志
注意，已构建发布的release运行时，cc.log、cc.warn无法拦截，只能拦截cc.error和console日志

![拦截日志](.\images\7_拦截日志.gif)

### 8. 切换spine动画
除了spine，还支持预览切换dragon、cc.Animation动画

![切换spine动画](.\images\8_切换spine动画.gif)

### 9. 查看可写路径
所有的native运行时都支持查看可写路径（native.fileUtils.getWritablePath()），并下载手机可写路径内的文件到本地，此处以windows为例。

![查看可写路径](.\images\9_查看可写路径.gif)