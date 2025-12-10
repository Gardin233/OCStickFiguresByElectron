# GardinStickFigures

基于 Electron + TypeScript + Vite + PixiJSv6 + pixi-spine ，需要Spine 3.8 model

## 为什么我要做这个？

我喜欢Alan Becker的火柴人系列，尽管我一点动画美工不会，但是用代码我也可以实现自己的火柴人在自己屏幕上跳上跳下!不过，我只是个普通的学生，所以我基本上是边学边做的，所以可能会发现许多AI代码，大佬们轻点喷😭

展示的Spine模型采用的是我的oc，我对动画还需要学习很多......

## 当前的项目结构


├── external                  # 操作 WinAPI 的外部程序
├── src                       # Electron 主程序
│   ├── client                # 前端用户逻辑
│   │   ├── character         # 角色相关
│   │   ├── effectsLayer      # 特效层
│   │   └── utils             # 工具函数
│   │
│   ├── server                # 后台服务逻辑
│   │   ├── hooks             # 各种钩子
│   │   ├── ipc               # IPC 通信封装
│   │   ├── process           # 持久化进程
│   │   └── utils             # 工具函数
│   │
│   ├── utils                 # 通用工具
│   └── types                 # TypeScript 类型定义
