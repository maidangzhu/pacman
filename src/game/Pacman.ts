import { GameObject } from "../core/GameObject";
import { ColliderType, Collider } from "../physics/PhysicsEngine";
import { Map, TileType } from "./Map";
import { EventManager, GameEventType } from "../events/EventManager";
import { InputManager } from "../input/InputManager";

/**
 * 移动方向枚举
 */
export enum Direction {
  NONE = "NONE",
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

/**
 * 吃豆人状态
 */
export enum PacmanState {
  NORMAL,
  POWERED,
  DEAD,
}

/**
 * 吃豆人类
 */
export class Pacman extends GameObject {
  private direction: Direction = Direction.NONE;
  private nextDirection: Direction = Direction.NONE;
  private speed: number = 100; // 像素/秒
  private state: PacmanState = PacmanState.NORMAL;
  private powerTimer: number = 0;
  private powerDuration: number = 10; // 能量持续时间（秒）
  private map: Map;
  private mouthAngle: number = 0;
  private mouthSpeed: number = 5; // 嘴巴动画速度
  private mouthOpen: boolean = false;

  constructor(map: Map, startX: number, startY: number) {
    super(startX, startY);
    this.map = map;
    this.setupCollider();
    this.setupInputHandlers();
  }

  /**
   * 设置碰撞体
   */
  private setupCollider(): void {
    const collider: Collider = {
      type: ColliderType.CIRCLE,
      position: this.getPosition(),
      radius: this.map.getTileSize() / 2 - 2, // 略小于格子大小
    };
    this.getPhysicsEngine().addCollider("pacman", collider);
  }

  /**
   * 设置输入处理
   */
  private setupInputHandlers(): void {
    const inputManager = InputManager.getInstance();
    const eventManager = EventManager.getInstance();

    eventManager.on(GameEventType.KEY_DOWN, (key: string) => {
      switch (key) {
        case "arrowup":
          this.nextDirection = Direction.UP;
          break;
        case "arrowdown":
          this.nextDirection = Direction.DOWN;
          break;
        case "arrowleft":
          this.nextDirection = Direction.LEFT;
          break;
        case "arrowright":
          this.nextDirection = Direction.RIGHT;
          break;
      }
    });
  }

  /**
   * 检查是否可以在指定方向上移动
   */
  private canMove(direction: Direction): boolean {
    const position = this.getPosition();
    const gridPos = this.map.worldToGrid(position);
    let nextX = gridPos.x;
    let nextY = gridPos.y;

    switch (direction) {
      case Direction.UP:
        nextY--;
        break;
      case Direction.DOWN:
        nextY++;
        break;
      case Direction.LEFT:
        nextX--;
        break;
      case Direction.RIGHT:
        nextX++;
        break;
      default:
        return false;
    }

    return this.map.getTileAt(nextX, nextY) !== TileType.WALL;
  }

  /**
   * 移动吃豆人
   */
  private move(deltaTime: number): void {
    // 检查是否可以转向
    if (
      this.nextDirection !== Direction.NONE &&
      this.canMove(this.nextDirection)
    ) {
      this.direction = this.nextDirection;
      this.nextDirection = Direction.NONE;
    }

    // 如果当前方向不能移动，停止
    if (!this.canMove(this.direction)) {
      return;
    }

    // 计算移动距离
    const distance = this.speed * deltaTime;
    const position = this.getPosition();

    // 根据方向更新位置
    switch (this.direction) {
      case Direction.UP:
        this.setPosition(position.x, position.y - distance);
        break;
      case Direction.DOWN:
        this.setPosition(position.x, position.y + distance);
        break;
      case Direction.LEFT:
        this.setPosition(position.x - distance, position.y);
        break;
      case Direction.RIGHT:
        this.setPosition(position.x + distance, position.y);
        break;
    }

    // 更新碰撞体位置
    const collider = this.getPhysicsEngine().getCollider("pacman");
    if (collider) {
      collider.position = this.getPosition();
    }

    // 检查是否吃到豆子
    this.checkDotCollection();
  }

  /**
   * 检查是否吃到豆子
   */
  private checkDotCollection(): void {
    const position = this.getPosition();
    const gridPos = this.map.worldToGrid(position);
    const tile = this.map.getTileAt(gridPos.x, gridPos.y);

    if (tile === TileType.DOT) {
      this.map.setTileAt(gridPos.x, gridPos.y, TileType.PATH);
      EventManager.getInstance().emit("DOT_COLLECTED");
    } else if (tile === TileType.POWER) {
      this.map.setTileAt(gridPos.x, gridPos.y, TileType.PATH);
      this.setPowered();
      EventManager.getInstance().emit("POWER_COLLECTED");
    }
  }

  /**
   * 设置能量状态
   */
  private setPowered(): void {
    this.state = PacmanState.POWERED;
    this.powerTimer = this.powerDuration;
  }

  /**
   * 更新能量状态
   */
  private updatePowerState(deltaTime: number): void {
    if (this.state === PacmanState.POWERED) {
      this.powerTimer -= deltaTime;
      if (this.powerTimer <= 0) {
        this.state = PacmanState.NORMAL;
      }
    }
  }

  /**
   * 更新嘴巴动画
   */
  private updateMouthAnimation(deltaTime: number): void {
    if (this.direction !== Direction.NONE) {
      this.mouthAngle += this.mouthSpeed * (this.mouthOpen ? -1 : 1);
      if (this.mouthAngle >= 45) {
        this.mouthOpen = true;
      } else if (this.mouthAngle <= 0) {
        this.mouthOpen = false;
      }
    }
  }

  protected onUpdate(deltaTime: number): void {
    this.move(deltaTime);
    this.updatePowerState(deltaTime);
    this.updateMouthAnimation(deltaTime);
  }

  protected onRender(context: CanvasRenderingContext2D): void {
    const position = this.getPosition();
    const size = this.map.getTileSize();

    context.save();
    context.translate(position.x, position.y);

    // 根据移动方向旋转
    let rotation = 0;
    switch (this.direction) {
      case Direction.UP:
        rotation = -Math.PI / 2;
        break;
      case Direction.DOWN:
        rotation = Math.PI / 2;
        break;
      case Direction.LEFT:
        rotation = Math.PI;
        break;
      case Direction.RIGHT:
        rotation = 0;
        break;
    }
    context.rotate(rotation);

    // 绘制吃豆人
    context.fillStyle =
      this.state === PacmanState.POWERED ? "#FFFF00" : "#FFFF00";
    context.beginPath();
    context.arc(
      0,
      0,
      size / 2 - 2,
      (this.mouthAngle * Math.PI) / 180,
      ((360 - this.mouthAngle) * Math.PI) / 180
    );
    context.lineTo(0, 0);
    context.closePath();
    context.fill();

    context.restore();
  }

  /**
   * 获取当前状态
   */
  public getState(): PacmanState {
    return this.state;
  }

  /**
   * 设置死亡状态
   */
  public die(): void {
    this.state = PacmanState.DEAD;
    EventManager.getInstance().emit("PACMAN_DIED");
  }
}
