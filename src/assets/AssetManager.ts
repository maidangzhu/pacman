import { EventManager, GameEventType } from "../events/EventManager";

/**
 * 资源类型枚举
 */
export enum AssetType {
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  JSON = "JSON",
}

/**
 * 资源接口
 */
export interface Asset {
  type: AssetType;
  url: string;
  data?: any;
}

/**
 * 资源管理器类
 * 处理游戏资源的加载和缓存
 */
export class AssetManager {
  private static instance: AssetManager;
  private assets: Map<string, Asset>;
  private loadingCount: number;
  private eventManager: EventManager;

  private constructor() {
    this.assets = new Map();
    this.loadingCount = 0;
    this.eventManager = EventManager.getInstance();
  }

  /**
   * 获取资源管理器实例
   */
  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * 加载单个资源
   */
  public async loadAsset(
    id: string,
    url: string,
    type: AssetType
  ): Promise<void> {
    if (this.assets.has(id)) {
      console.warn(`Asset ${id} already exists`);
      return;
    }

    this.loadingCount++;
    const asset: Asset = { type, url };

    try {
      switch (type) {
        case AssetType.IMAGE:
          asset.data = await this.loadImage(url);
          break;
        case AssetType.AUDIO:
          asset.data = await this.loadAudio(url);
          break;
        case AssetType.JSON:
          asset.data = await this.loadJSON(url);
          break;
      }

      this.assets.set(id, asset);
      this.eventManager.emit(GameEventType.ASSET_LOADED, id, asset);
    } catch (error) {
      console.error(`Error loading asset ${id}:`, error);
      this.eventManager.emit(GameEventType.ASSET_ERROR, id, error);
    } finally {
      this.loadingCount--;
    }
  }

  /**
   * 加载多个资源
   */
  public async loadAssets(
    assets: { id: string; url: string; type: AssetType }[]
  ): Promise<void> {
    const promises = assets.map((asset) =>
      this.loadAsset(asset.id, asset.url, asset.type)
    );
    await Promise.all(promises);
  }

  /**
   * 加载图片资源
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  /**
   * 加载音频资源
   */
  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = reject;
      audio.src = url;
    });
  }

  /**
   * 加载JSON资源
   */
  private async loadJSON(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  /**
   * 获取资源
   */
  public getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * 移除资源
   */
  public removeAsset(id: string): void {
    this.assets.delete(id);
  }

  /**
   * 检查是否正在加载资源
   */
  public isLoading(): boolean {
    return this.loadingCount > 0;
  }

  /**
   * 清除所有资源
   */
  public clear(): void {
    this.assets.clear();
    this.loadingCount = 0;
  }

  /**
   * 获取所有资源
   */
  public getAllAssets(): Map<string, Asset> {
    return new Map(this.assets);
  }
}
