import { GameObject } from "../core/GameObject";
import { Vector2D } from "../math/Vector2D";
import { ColliderType, Collider } from "../physics/PhysicsEngine";

/**
 * 地图单元格类型
 */
export enum TileType {
  WALL = 1, // 墙
  PATH = 0, // 路径
  DOT = 2, // 普通豆子
  POWER = 3, // 能量豆
}

/**
 * 地图类
 */
export class Map extends GameObject {
  private grid: TileType[][];
  private tileSize: number;
  private wallColor: string = "#2121DE";
  private backgroundColor: string = "#000000";

  constructor() {
    super(0, 0);
    this.tileSize = 20; // 每个格子的大小
    this.grid = this.createDefaultMap();
    this.setupColliders();
  }

  /**
   * 创建默认地图
   */
  private createDefaultMap(): TileType[][] {
    // 28x31的经典吃豆人地图
    return [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 3, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0,
        0, 0, 0, 0,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1,
        2, 2, 3, 1,
      ],
      [
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        2, 1, 1, 1,
      ],
      [
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        2, 1, 1, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 1,
      ],
      [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
    ];
  }

  /**
   * 设置墙体碰撞器
   */
  private setupColliders(): void {
    const physicsEngine = this.getPhysicsEngine();

    // 为每个墙体添加碰撞器
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === TileType.WALL) {
          const collider: Collider = {
            type: ColliderType.RECTANGLE,
            position: new Vector2D(x * this.tileSize, y * this.tileSize),
            width: this.tileSize,
            height: this.tileSize,
          };
          physicsEngine.addCollider(`wall_${x}_${y}`, collider);
        }
      }
    }
  }

  /**
   * 获取指定位置的格子类型
   */
  public getTileAt(x: number, y: number): TileType {
    if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
      return this.grid[y][x];
    }
    return TileType.WALL;
  }

  /**
   * 设置指定位置的格子类型
   */
  public setTileAt(x: number, y: number, type: TileType): void {
    if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
      this.grid[y][x] = type;
    }
  }

  /**
   * 获取地图尺寸
   */
  public getSize(): { width: number; height: number } {
    return {
      width: this.grid[0].length * this.tileSize,
      height: this.grid.length * this.tileSize,
    };
  }

  /**
   * 获取格子大小
   */
  public getTileSize(): number {
    return this.tileSize;
  }

  /**
   * 将世界坐标转换为网格坐标
   */
  public worldToGrid(position: Vector2D): Vector2D {
    return new Vector2D(
      Math.floor(position.x / this.tileSize),
      Math.floor(position.y / this.tileSize)
    );
  }

  /**
   * 将网格坐标转换为世界坐标
   */
  public gridToWorld(gridPosition: Vector2D): Vector2D {
    return new Vector2D(
      gridPosition.x * this.tileSize + this.tileSize / 2,
      gridPosition.y * this.tileSize + this.tileSize / 2
    );
  }

  protected onUpdate(deltaTime: number): void {
    // 地图不需要更新逻辑
  }

  protected onRender(context: CanvasRenderingContext2D): void {
    // 绘制背景
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, this.getSize().width, this.getSize().height);

    // 绘制地图
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const tile = this.grid[y][x];
        const px = x * this.tileSize;
        const py = y * this.tileSize;

        switch (tile) {
          case TileType.WALL:
            context.fillStyle = this.wallColor;
            context.fillRect(px, py, this.tileSize, this.tileSize);
            break;
          case TileType.DOT:
            context.fillStyle = "#FFFFFF";
            context.beginPath();
            context.arc(
              px + this.tileSize / 2,
              py + this.tileSize / 2,
              2,
              0,
              Math.PI * 2
            );
            context.fill();
            break;
          case TileType.POWER:
            context.fillStyle = "#FFFFFF";
            context.beginPath();
            context.arc(
              px + this.tileSize / 2,
              py + this.tileSize / 2,
              6,
              0,
              Math.PI * 2
            );
            context.fill();
            break;
        }
      }
    }
  }
}
