import { Vector2D } from "../math/Vector2D";
import { Engine } from "./Engine";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { EventManager } from "../events/EventManager";

/**
 * 游戏对象基类
 * 所有游戏中的实体都继承自该类
 */
export abstract class GameObject {
  private position: Vector2D;
  private isActive: boolean;

  constructor(x: number = 0, y: number = 0) {
    this.position = new Vector2D(x, y);
    this.isActive = true;
  }

  public getPosition(): Vector2D {
    return this.position;
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public isActiveObject(): boolean {
    return this.isActive;
  }

  public setActive(active: boolean): void {
    this.isActive = active;
  }

  protected getEngine(): Engine {
    return Engine.getInstance();
  }

  protected getPhysicsEngine(): PhysicsEngine {
    return this.getEngine().getPhysicsEngine();
  }

  protected getEventManager(): EventManager {
    return this.getEngine().getEventManager();
  }

  public update(deltaTime: number): void {
    if (this.isActive) {
      this.onUpdate(deltaTime);
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    if (this.isActive) {
      this.onRender(context);
    }
  }

  protected abstract onUpdate(deltaTime: number): void;
  protected abstract onRender(context: CanvasRenderingContext2D): void;
}
