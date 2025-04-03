import { Layer } from "./Layer";

/**
 * 预定义图层名称
 */
export enum LayerName {
  BACKGROUND = "BACKGROUND",
  GAME = "GAME",
  UI = "UI",
  OVERLAY = "OVERLAY",
}

/**
 * 图层管理器类
 * 管理所有渲染图层
 */
export class LayerManager {
  private static instance: LayerManager;
  private layers: Map<string, Layer>;

  private constructor() {
    this.layers = new Map();
    this.initializeLayers();
  }

  /**
   * 获取图层管理器实例
   */
  public static getInstance(): LayerManager {
    if (!LayerManager.instance) {
      LayerManager.instance = new LayerManager();
    }
    return LayerManager.instance;
  }

  /**
   * 初始化默认图层
   */
  private initializeLayers(): void {
    this.createLayer(LayerName.BACKGROUND, 0);
    this.createLayer(LayerName.GAME, 1);
    this.createLayer(LayerName.UI, 2);
    this.createLayer(LayerName.OVERLAY, 3);
  }

  /**
   * 创建新图层
   */
  public createLayer(name: string, zIndex: number): Layer {
    if (this.layers.has(name)) {
      throw new Error(`Layer ${name} already exists`);
    }

    const layer = new Layer(name, zIndex);
    this.layers.set(name, layer);
    return layer;
  }

  /**
   * 获取图层
   */
  public getLayer(name: string): Layer | undefined {
    return this.layers.get(name);
  }

  /**
   * 删除图层
   */
  public removeLayer(name: string): void {
    this.layers.delete(name);
  }

  /**
   * 更新所有图层
   */
  public update(deltaTime: number): void {
    // 按照zIndex排序图层
    const sortedLayers = Array.from(this.layers.values()).sort(
      (a, b) => a.getZIndex() - b.getZIndex()
    );

    // 更新每个图层
    sortedLayers.forEach((layer) => {
      layer.update(deltaTime);
    });
  }

  /**
   * 渲染所有图层
   */
  public render(context: CanvasRenderingContext2D): void {
    // 按照zIndex排序图层
    const sortedLayers = Array.from(this.layers.values()).sort(
      (a, b) => a.getZIndex() - b.getZIndex()
    );

    // 渲染每个图层
    sortedLayers.forEach((layer) => {
      layer.render(context);
    });
  }

  /**
   * 清空所有图层
   */
  public clear(): void {
    this.layers.forEach((layer) => {
      layer.clear();
    });
  }

  /**
   * 获取所有图层
   */
  public getLayers(): Map<string, Layer> {
    return new Map(this.layers);
  }
}
