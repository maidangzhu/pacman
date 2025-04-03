/**
 * 游戏事件类型枚举
 */
export enum GameEventType {
  KEY_DOWN = "KEY_DOWN",
  KEY_UP = "KEY_UP",
  MOUSE_MOVE = "MOUSE_MOVE",
  MOUSE_DOWN = "MOUSE_DOWN",
  MOUSE_UP = "MOUSE_UP",
  GAME_START = "GAME_START",
  GAME_PAUSE = "GAME_PAUSE",
  GAME_RESUME = "GAME_RESUME",
  GAME_OVER = "GAME_OVER",
  DOT_COLLECTED = "DOT_COLLECTED",
  POWER_COLLECTED = "POWER_COLLECTED",
  GHOST_EATEN = "GHOST_EATEN",
  PACMAN_DIED = "PACMAN_DIED",
  LEVEL_COMPLETE = "LEVEL_COMPLETE",
  SCORE_CHANGED = "SCORE_CHANGED",
}

/**
 * 事件处理器类型
 */
type EventHandler = (data?: any) => void;

/**
 * 事件管理器类
 */
export class EventManager {
  private static instance: EventManager;
  private eventHandlers: Map<string, Set<EventHandler>>;

  private constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * 注册事件监听器
   * @param eventType 事件类型
   * @param handler 事件处理函数
   */
  public on(eventType: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * 移除事件监听器
   * @param eventType 事件类型
   * @param handler 事件处理函数
   */
  public off(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
      }
    }
  }

  /**
   * 移除指定事件类型的所有监听器
   * @param eventType 事件类型
   */
  public removeAllListeners(eventType: string): void {
    this.eventHandlers.delete(eventType);
  }

  /**
   * 触发事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  public emit(eventType: string, data?: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * 检查是否有指定事件类型的监听器
   * @param eventType 事件类型
   */
  public hasListeners(eventType: string): boolean {
    const handlers = this.eventHandlers.get(eventType);
    return handlers !== undefined && handlers.size > 0;
  }

  /**
   * 获取指定事件类型的监听器数量
   * @param eventType 事件类型
   */
  public listenerCount(eventType: string): number {
    const handlers = this.eventHandlers.get(eventType);
    return handlers ? handlers.size : 0;
  }

  /**
   * 清除所有事件监听器
   */
  public clear(): void {
    this.eventHandlers.clear();
  }
}
