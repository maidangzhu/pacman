import { EventManager, GameEventType } from "../events/EventManager";
import { Vector2D } from "../math/Vector2D";

/**
 * 按键状态
 */
export enum KeyState {
  UP = "UP",
  DOWN = "DOWN",
}

/**
 * 鼠标按键
 */
export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

/**
 * 输入管理器类
 * 处理键盘和鼠标输入
 */
export class InputManager {
  private static instance: InputManager;
  private keyStates: Map<string, KeyState>;
  private mousePosition: Vector2D;
  private mouseButtons: Map<number, boolean>;
  private eventManager: EventManager;
  private canvas: HTMLCanvasElement | null = null;

  private constructor() {
    this.keyStates = new Map();
    this.mousePosition = new Vector2D();
    this.mouseButtons = new Map();
    this.eventManager = EventManager.getInstance();
  }

  /**
   * 获取输入管理器实例
   */
  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  /**
   * 初始化输入事件监听
   */
  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;

    // 键盘事件
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));

    // 鼠标事件
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * 处理键盘按下事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keyStates.set(key, KeyState.DOWN);
    this.eventManager.emit(GameEventType.KEY_DOWN, key);
  }

  /**
   * 处理键盘释放事件
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keyStates.set(key, KeyState.UP);
    this.eventManager.emit(GameEventType.KEY_UP, key);
  }

  /**
   * 处理鼠标移动事件
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.eventManager.emit(GameEventType.MOUSE_MOVE, { x, y });
  }

  /**
   * 处理鼠标按下事件
   */
  private handleMouseDown(event: MouseEvent): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.eventManager.emit(GameEventType.MOUSE_DOWN, {
      x,
      y,
      button: event.button,
    });
  }

  /**
   * 处理鼠标释放事件
   */
  private handleMouseUp(event: MouseEvent): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.eventManager.emit(GameEventType.MOUSE_UP, {
      x,
      y,
      button: event.button,
    });
  }

  /**
   * 检查按键是否被按下
   */
  public isKeyDown(key: string): boolean {
    return this.keyStates.get(key.toLowerCase()) === KeyState.DOWN;
  }

  /**
   * 检查按键是否被释放
   */
  public isKeyUp(key: string): boolean {
    return this.keyStates.get(key.toLowerCase()) === KeyState.UP;
  }

  /**
   * 获取鼠标位置
   */
  public getMousePosition(): Vector2D {
    return this.mousePosition.clone();
  }

  /**
   * 清除所有输入状态
   */
  public cleanup(): void {
    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    this.keyStates.clear();
  }

  /**
   * 检查鼠标按键是否被按下
   */
  public isMouseButtonPressed(button: MouseButton): boolean {
    return this.mouseButtons.get(button) || false;
  }

  /**
   * 销毁输入管理器
   */
  public destroy(): void {
    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    this.keyStates.clear();
    this.mouseButtons.clear();
  }
}
