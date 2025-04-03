import { Layer } from "./Layer";

export class LayerManager {
  private static instance: LayerManager;
  private layers: Map<string, Layer>;
  private mainLayer: Layer;

  private constructor() {
    this.layers = new Map();
    this.mainLayer = new Layer("main");
    this.addLayer(this.mainLayer);
  }

  public static getInstance(): LayerManager {
    if (!LayerManager.instance) {
      LayerManager.instance = new LayerManager();
    }
    return LayerManager.instance;
  }

  public addLayer(layer: Layer): void {
    this.layers.set(layer.getName(), layer);
  }

  public getLayer(name: string): Layer | undefined {
    return this.layers.get(name);
  }

  public removeLayer(name: string): void {
    this.layers.delete(name);
  }

  public getMainLayer(): Layer {
    return this.mainLayer;
  }

  public update(deltaTime: number): void {
    this.layers.forEach((layer) => {
      layer.update(deltaTime);
    });
  }

  public render(context: CanvasRenderingContext2D): void {
    this.layers.forEach((layer) => {
      layer.render(context);
    });
  }

  public clear(): void {
    this.layers.clear();
    this.mainLayer = new Layer("main");
    this.addLayer(this.mainLayer);
  }
}
