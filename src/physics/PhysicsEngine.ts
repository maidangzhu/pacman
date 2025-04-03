import { Vector2D } from "../math/Vector2D";
import { EventManager, GameEventType } from "../events/EventManager";

/**
 * 碰撞体类型
 */
export enum ColliderType {
  CIRCLE = "CIRCLE",
  RECTANGLE = "RECTANGLE",
}

/**
 * 碰撞体接口
 */
export interface Collider {
  type: ColliderType;
  position: Vector2D;
  radius?: number; // for CIRCLE
  width?: number; // for RECTANGLE
  height?: number; // for RECTANGLE
}

/**
 * 物理引擎类
 * 处理碰撞检测和物理模拟
 */
export class PhysicsEngine {
  private static instance: PhysicsEngine;
  private colliders: Map<string, Collider>;
  private eventManager: EventManager;

  private constructor() {
    this.colliders = new Map();
    this.eventManager = EventManager.getInstance();
  }

  /**
   * 获取物理引擎实例
   */
  public static getInstance(): PhysicsEngine {
    if (!PhysicsEngine.instance) {
      PhysicsEngine.instance = new PhysicsEngine();
    }
    return PhysicsEngine.instance;
  }

  /**
   * 添加碰撞体
   */
  public addCollider(id: string, collider: Collider): void {
    this.colliders.set(id, collider);
  }

  /**
   * 移除碰撞体
   */
  public removeCollider(id: string): void {
    this.colliders.delete(id);
  }

  /**
   * 获取碰撞体
   */
  public getCollider(id: string): Collider | undefined {
    return this.colliders.get(id);
  }

  /**
   * 更新物理系统
   */
  public update(deltaTime: number): void {
    // 在这里可以添加物理模拟逻辑
    // 例如：重力、速度、加速度等
  }

  /**
   * 检查所有碰撞体之间的碰撞
   */
  private checkCollisions(): void {
    const colliders = Array.from(this.colliders.entries());

    for (let i = 0; i < colliders.length; i++) {
      for (let j = i + 1; j < colliders.length; j++) {
        const [id1, collider1] = colliders[i];
        const [id2, collider2] = colliders[j];

        if (this.checkCollision(id1, id2)) {
          this.eventManager.emit(GameEventType.COLLISION_ENTER, id1, id2);
        }
      }
    }
  }

  /**
   * 检查两个碰撞体之间是否发生碰撞
   */
  public checkCollision(id1: string, id2: string): boolean {
    const collider1 = this.colliders.get(id1);
    const collider2 = this.colliders.get(id2);

    if (!collider1 || !collider2) return false;

    switch (collider1.type) {
      case ColliderType.CIRCLE:
        if (collider2.type === ColliderType.CIRCLE) {
          return this.checkCircleCircleCollision(collider1, collider2);
        } else {
          return this.checkCircleRectangleCollision(collider1, collider2);
        }
      case ColliderType.RECTANGLE:
        if (collider2.type === ColliderType.CIRCLE) {
          return this.checkCircleRectangleCollision(collider2, collider1);
        } else {
          return this.checkRectangleRectangleCollision(collider1, collider2);
        }
    }
  }

  /**
   * 检查两个圆形碰撞体之间的碰撞
   */
  private checkCircleCircleCollision(
    circle1: Collider,
    circle2: Collider
  ): boolean {
    if (!circle1.radius || !circle2.radius) return false;

    const dx = circle1.position.x - circle2.position.x;
    const dy = circle1.position.y - circle2.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.radius + circle2.radius;
  }

  /**
   * 检查两个矩形碰撞体之间的碰撞
   */
  private checkRectangleRectangleCollision(
    rect1: Collider,
    rect2: Collider
  ): boolean {
    if (!rect1.width || !rect1.height || !rect2.width || !rect2.height)
      return false;

    return (
      rect1.position.x < rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width > rect2.position.x &&
      rect1.position.y < rect2.position.y + rect2.height &&
      rect1.position.y + rect1.height > rect2.position.y
    );
  }

  /**
   * 检查圆形和矩形碰撞体之间的碰撞
   */
  private checkCircleRectangleCollision(
    circle: Collider,
    rect: Collider
  ): boolean {
    if (!circle.radius || !rect.width || !rect.height) return false;

    const closestX = Math.max(
      rect.position.x,
      Math.min(circle.position.x, rect.position.x + rect.width)
    );
    const closestY = Math.max(
      rect.position.y,
      Math.min(circle.position.y, rect.position.y + rect.height)
    );

    const dx = circle.position.x - closestX;
    const dy = circle.position.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle.radius;
  }

  /**
   * 清除所有碰撞体
   */
  public clear(): void {
    this.colliders.clear();
  }
}
