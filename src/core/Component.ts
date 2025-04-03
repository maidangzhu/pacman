import { GameObject } from "./GameObject";

/**
 * 组件基类
 * 所有组件都继承自该类，用于扩展游戏对象的功能
 */
export abstract class Component {
  private gameObject: GameObject | null = null;
  private enabled: boolean = true;

  /**
   * 设置所属的游戏对象
   */
  public setGameObject(gameObject: GameObject): void {
    this.gameObject = gameObject;
  }

  /**
   * 获取所属的游戏对象
   */
  public getGameObject(): GameObject | null {
    return this.gameObject;
  }

  /**
   * 检查组件是否启用
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 设置组件启用状态
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 组件初始化
   * 在组件被添加到游戏对象时调用
   */
  public abstract init(): void;

  /**
   * 组件更新
   * 每帧调用
   */
  public abstract update(deltaTime: number): void;

  /**
   * 组件渲染
   * 每帧调用
   */
  public abstract render(context: CanvasRenderingContext2D): void;

  /**
   * 组件销毁
   * 在组件被移除时调用
   */
  public abstract destroy(): void;
}
