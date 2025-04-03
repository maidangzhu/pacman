/**
 * 2D向量类
 * 用于处理2D空间中的向量运算
 */
export class Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * 向量加法
   */
  public add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * 向量减法
   */
  public subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * 向量缩放
   */
  public multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * 向量除法
   */
  public divide(scalar: number): Vector2D {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  /**
   * 向量长度
   */
  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 向量标准化
   */
  public normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D();
    return this.divide(mag);
  }

  /**
   * 向量点积
   */
  public dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * 向量距离
   */
  public distance(other: Vector2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 向量角度
   */
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * 向量旋转
   */
  public rotate(angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * 克隆向量
   */
  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * 向量相等判断
   */
  public equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * 向量转字符串
   */
  public toString(): string {
    return `Vector2D(${this.x}, ${this.y})`;
  }

  // 静态方法
  /**
   * 零向量
   */
  public static zero(): Vector2D {
    return new Vector2D(0, 0);
  }

  /**
   * 单位向量
   */
  public static one(): Vector2D {
    return new Vector2D(1, 1);
  }

  /**
   * 向上的单位向量
   */
  public static up(): Vector2D {
    return new Vector2D(0, -1);
  }

  /**
   * 向下的单位向量
   */
  public static down(): Vector2D {
    return new Vector2D(0, 1);
  }

  /**
   * 向左的单位向量
   */
  public static left(): Vector2D {
    return new Vector2D(-1, 0);
  }

  /**
   * 向右的单位向量
   */
  public static right(): Vector2D {
    return new Vector2D(1, 0);
  }
}
