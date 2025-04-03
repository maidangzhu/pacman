# Canvas Game Engine

这是一个基于 Next.js 构建的 2D 游戏引擎项目，目前实现了类似吃豆人的游戏demo。项目采用模块化设计，使用 TypeScript 确保类型安全。

## 项目架构

项目采用分层架构设计，各模块职责明确，具体如下：

```
src/
├── app/          # Next.js 应用入口
├── assets/       # 静态资源文件（图片、音频等）
├── components/   # React 组件
├── core/         # 游戏引擎核心
│   ├── Engine.ts       # 游戏引擎主类
│   ├── GameObject.ts   # 游戏对象基类
│   └── Component.ts    # 组件系统基类
├── events/       # 事件系统
├── game/         # 游戏逻辑实现
│   ├── Map.ts         # 游戏地图实现
│   └── Pacman.ts      # 吃豆人游戏逻辑
├── input/        # 输入处理系统
├── layers/       # 游戏图层管理
├── math/         # 数学计算工具
├── physics/      # 物理引擎系统
└── renderer/     # 渲染系统
```

### 核心模块说明

1. **core/** - 引擎核心
   - 实现了游戏引擎的基础架构
   - 包含游戏对象和组件系统
   - 管理游戏生命周期

2. **events/** - 事件系统
   - 处理游戏内的事件分发
   - 实现观察者模式
   - 管理事件的订阅和触发

3. **physics/** - 物理系统
   - 处理碰撞检测
   - 实现物理模拟
   - 管理物体运动

4. **renderer/** - 渲染系统
   - 处理游戏画面渲染
   - 管理精灵和动画
   - 优化渲染性能

5. **input/** - 输入系统
   - 处理键盘、鼠标输入
   - 支持自定义按键映射
   - 管理输入状态

6. **layers/** - 图层系统
   - 管理游戏场景的多个图层
   - 处理图层之间的交互
   - 控制渲染顺序

7. **math/** - 数学工具
   - 提供向量运算
   - 包含碰撞检测算法
   - 其他游戏相关的数学函数

8. **game/** - 游戏实现
   - 具体游戏逻辑
   - 游戏规则实现
   - 关卡设计

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 技术栈

- Next.js - React 框架
- TypeScript - 类型安全
- Canvas API - 2D 渲染
- Web Audio API - 音频处理

## 开发指南

1. 游戏对象创建
   - 继承 `GameObject` 类
   - 实现必要的生命周期方法

2. 组件开发
   - 继承 `Component` 类
   - 实现组件特定功能

3. 场景构建
   - 使用图层系统组织场景
   - 管理游戏对象

## 贡献指南

欢迎提交 Pull Request 和 Issue！

## 许可证

[MIT](LICENSE)
