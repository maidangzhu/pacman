/**
 * 事件处理函数类型
 */
type EventHandler = (...args: any[]) => void;

/**
 * 事件发射器类
 * 实现观察者模式，用于事件的订阅和发布
 */
export class EventEmitter {
  private events: Map<string, EventHandler[]>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   */
  public on(eventName: string, handler: EventHandler): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)!.push(handler);
  }

  /**
   * 取消订阅事件
   */
  public off(eventName: string, handler: EventHandler): void {
    if (!this.events.has(eventName)) return;

    const handlers = this.events.get(eventName)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * 触发事件
   */
  public emit(eventName: string, ...args: any[]): void {
    if (!this.events.has(eventName)) return;

    const handlers = this.events.get(eventName)!;
    handlers.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  /**
   * 只订阅一次事件
   */
  public once(eventName: string, handler: EventHandler): void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(eventName, onceHandler);
    };
    this.on(eventName, onceHandler);
  }

  /**
   * 清除所有事件监听
   */
  public clear(): void {
    this.events.clear();
  }

  /**
   * 获取事件监听器数量
   */
  public listenerCount(eventName: string): number {
    return this.events.has(eventName) ? this.events.get(eventName)!.length : 0;
  }
}
