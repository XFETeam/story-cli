# story-cli

> 团队定制化 storybook, 并能够使用内部 xpx 长期缓存使用

## 什么是 storybook 

Storybook是一个辅助UI控件开发的工具。通过story创建独立的控件，让每个控件开发都有一个独立的开发调试环境。 Storybook的运行不依赖于项目，开发人员不用担心由于开发环境、依赖问题导致不能开发控件。

## 安装

```bash
    yarn global add story-cli
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
    story-cli start -w src
```

需要注意的是, 默认情况下, 当前工具只会监测 ' /\.story\.js$/' 即 story.js 结尾的文件. 暂时不开放该配置, 目的是约束确保整个团队 storybook
开发编写规范.


## 命令

```bash
D:\Project\story>story-cli
Usage:  [options] [command]

Options:
  -V, --version            output the version number
  -p, --port               story book
  -c, --config-dir <path>  设置配置文件路径, 默认路径为 webpack.config.js, 对于复杂需求可以用于区分多个不同的环境
  -h, --help               output usage information

Commands:
  start|s
```

## 变更日志
#### 0.0.1 (2019-10-25)

* feat: init commit

## 作者
She Ailun, Huang Zhe
