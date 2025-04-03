import { GameObject } from "../core/GameObject";

/**
 * 图层类
 * 用于管理特定渲染层级的游戏对象
 */
export class Layer {
  private name: string;
  private objects: GameObject[];
  private visible: boolean;
  private zIndex: number;

  constructor(name: string, zIndex: number = 0) {
    this.name = name;
    this.objects = [];
    this.visible = true;
    this.zIndex = zIndex;
  }

  /**
   * 添加游戏对象到图层
   */
  public addObject(object: GameObject): void {
    if (!this.objects.includes(object)) {
      this.objects.push(object);
    }
  }

  /**
   * 从图层移除游戏对象
   */
  public removeObject(object: GameObject): void {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  /**
   * 更新图层中的所有对象
   */
  public update(deltaTime: number): void {
    if (!this.visible) return;

    this.objects.forEach((object) => {
      if (object.isActiveObject()) {
        object.update(deltaTime);
      }
    });
  }

  /**
   * 渲染图层中的所有对象
   */
  public render(context: CanvasRenderingContext2D): void {
    if (!this.visible) return;

    this.objects.forEach((object) => {
      if (object.isActiveObject()) {
        object.render(context);
      }
    });
  }

  /**
   * 清空图层
   */
  public clear(): void {
    this.objects = [];
  }

  // Getter和Setter方法
  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
  }

  public getZIndex(): number {
    return this.zIndex;
  }

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }

  public getObjects(): GameObject[] {
    return [...this.objects];
  }
}
