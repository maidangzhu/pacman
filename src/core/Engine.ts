import { EventManager, GameEventType } from "../events/EventManager";
import { LayerManager } from "../layers/LayerManager";
import { InputManager } from "../input/InputManager";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { AssetManager } from "../assets/AssetManager";

/**
 * 游戏引擎核心类
 * 负责管理游戏循环、时间、各个管理器的初始化和更新
 */
export class Engine {
  private static instance: Engine | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private lastFrameTime: number = 0;
  private frameId: number = 0;

  // 系统管理器
  private eventManager: EventManager;
  private layerManager: LayerManager;
  private inputManager: InputManager;
  private physicsEngine: PhysicsEngine;
  private assetManager: AssetManager;

  private constructor() {
    this.eventManager = EventManager.getInstance();
    this.layerManager = LayerManager.getInstance();
    this.inputManager = InputManager.getInstance();
    this.physicsEngine = PhysicsEngine.getInstance();
    this.assetManager = AssetManager.getInstance();
  }

  /**
   * 获取引擎单例实例
   */
  public static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }

  public static destroyInstance(): void {
    Engine.instance = null;
  }

  /**
   * 设置画布大小和样式
   */
  public setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    if (!this.context) {
      throw new Error("Failed to get 2D context");
    }

    // 设置画布平滑
    this.context.imageSmoothingEnabled = false;

    // 初始化输入管理器
    this.inputManager.initialize(canvas);
  }

  /**
   * 开始游戏循环
   */
  public start(): void {
    if (!this.canvas || !this.context) {
      throw new Error("Canvas not set. Call setCanvas first.");
    }

    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.eventManager.emit(GameEventType.GAME_START);
    this.gameLoop();
  }

  /**
   * 停止游戏循环
   */
  public stop(): void {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.eventManager.emit(GameEventType.GAME_OVER);
  }

  /**
   * 暂停游戏
   */
  public pause(): void {
    if (!this.isPaused) {
      this.isPaused = true;
      this.eventManager.emit(GameEventType.GAME_PAUSE);
    }
  }

  /**
   * 恢复游戏
   */
  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastFrameTime = performance.now();
      this.eventManager.emit(GameEventType.GAME_RESUME);
    }
  }

  /**
   * 游戏主循环
   */
  private gameLoop(): void {
    if (!this.isRunning || !this.context) return;

    this.frameId = requestAnimationFrame(() => this.gameLoop());

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // 转换为秒
    this.lastFrameTime = currentTime;

    if (!this.isPaused) {
      this.update(deltaTime);
      this.render();
    }
  }

  /**
   * 更新游戏逻辑
   */
  private update(deltaTime: number): void {
    // 更新物理系统
    this.physicsEngine.update(deltaTime);

    // 更新游戏对象（通过图层管理器）
    this.layerManager.update(deltaTime);
  }

  /**
   * 渲染游戏画面
   */
  private render(): void {
    if (!this.context || !this.canvas) return;

    // 清空画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染所有图层
    this.layerManager.render(this.context);
  }

  /**
   * 获取画布上下文
   */
  public getContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  /**
   * 获取画布元素
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * 获取事件管理器
   */
  public getEventManager(): EventManager {
    return this.eventManager;
  }

  /**
   * 获取图层管理器
   */
  public getLayerManager(): LayerManager {
    return this.layerManager;
  }

  /**
   * 获取输入管理器
   */
  public getInputManager(): InputManager {
    return this.inputManager;
  }

  /**
   * 获取物理引擎
   */
  public getPhysicsEngine(): PhysicsEngine {
    return this.physicsEngine;
  }

  /**
   * 获取资源管理器
   */
  public getAssetManager(): AssetManager {
    return this.assetManager;
  }

  public isGameRunning(): boolean {
    return this.isRunning;
  }

  public isGamePaused(): boolean {
    return this.isPaused;
  }
}
