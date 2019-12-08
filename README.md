# story-cli

> 团队定制化 storybook, 并能够使用内部 xpx 长期缓存使用

## 什么是 storybook 

Storybook是一个辅助UI控件开发的工具。通过story创建独立的控件，让每个控件开发都有一个独立的开发调试环境。 Storybook的运行不依赖于项目，开发人员不用担心由于开发环境、依赖问题导致不能开发控件。

## 安装

```bash
    yarn global add @xfe-team/story-cli
```

## 规则

一般情况下, 我们都会提供更为完善的基础配置. 但由于底层 storybook react 自身暴露外部 api 限制较多, 故我们也进行一定的约束.
在项目中, 我们常常把源码放置 src 文件夹中, 那么启动 `story-cli` 命令执行如下:

基本目录结构

```txt
├─bin
│      index.js
│
├─src
│   └─button
│      │    index.js
│      │    index.less
│      │
│      └───story
│               index.story.js
│               README.md
```

```bash
    # 假设当前工作区处于根目录
    story-cli start
```

需要注意的是, 默认情况下, 当前工具只会监测 ' /\.story\.js$/' 即 story.js 结尾的文件. 暂时不开放该配置, 目的是约束确保整个团队 storybook
开发编写规范.


## 命令

```bash
D:\Project\story>story-cli
Usage:  [options] [command]

Options:
  -V, --version           output the version number
  -p, --port              设置storybook运行的端口号
  -w, --watch-dir <path>  storybook监听的目录, 默认监听当前目录的src
  -h, --help              output usage information

Commands:
  start|s                 启动
```

## 配置

在 cwd 工作区中, 创建 `.xfe-story/config.js` 后, 开发者可以通过该文件对一些内部行为进行一些直接配置, 以下

```javascript
module.exports = {
  /**
   * 常量, 这将作为 webpack definePlugin 使用
   */
  constants: webpackConfig.globalConst,
  /**
   * webpack 别名, 推荐使用 react, react-dom, 否者将会有2个 react 实例导致 react hook 报错
   */
  alias: {
    ...webpackConfig.resolve.alias,
    'react': path.resolve(__dirname, '../node_modules', 'react'),
    'react-dom': path.resolve(__dirname, '../node_modules', 'react-dom')
  },
  /**
   * postcss 配置, 当前只支持: postcss-px-to-viewport 插件
   */
  postcss: {
    'postcss-px-to-viewport': postcssConfig.plugins['postcss-px-to-viewport']
  },
  /**
   * storybook 默认使用设配窗口, 如: 'desktop', 'iphonex'
   */
  viewport: {
    defaults: 'iphonex'
  }
};
```

## 变更日志

#### 0.0.5 (2019-12-09)

* feat: 在 webpack rebuild 成功将再次显示 server 服务启动的地址, 这将有效解决开发者忘记最初启动的服务端口问题
* feat: 新增 .xfe-story/config.js 文件, 这个将通过文件直接进行内部 story 配置
* feat: 美化所有滚动条
* feat: 新增 postcss, 使其支持 rem 配置. 这样一来会与 mobile-react-v4.1 移动端环境更接近
* fix: 修复浏览器控制台关于 storybook 的警告性错误提示
* remove: 由于使用率低且反馈没什么作用, 移除 @storybook/addons 等 storybook 插件

#### 0.0.4 (2019-11-22)

* fix: 修复使用 story-cli 后无法使用 react-hook 的问题
* fix: 修复命令中无法使用修改端口 port

#### 0.0.2 (2019-10-28)

* 修复运行两次的bug

#### 0.0.1 (2019-10-25)

* feat: init commit

## 作者
She Ailun, Huang Zhe
