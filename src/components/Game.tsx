import { useEffect, useRef } from "react";
import { Engine } from "../core/Engine";
import { Map } from "../game/Map";
import { Pacman } from "../game/Pacman";
import { LayerName } from "../layers/LayerManager";

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 初始化游戏引擎
    const engine = Engine.getInstance();
    engineRef.current = engine;

    // 设置画布
    engine.setCanvas(canvasRef.current);

    // 创建游戏对象
    const map = new Map();
    const pacman = new Pacman(
      map,
      14 * map.getTileSize(),
      23 * map.getTileSize()
    ); // 放置在地图中间偏下位置

    // 添加到渲染层
    const gameLayer = engine.getLayerManager().getLayer(LayerName.GAME);
    if (gameLayer) {
      gameLayer.addObject(map);
      gameLayer.addObject(pacman);
    }

    // 开始游戏循环
    engine.start();

    // 清理函数
    return () => {
      engine.stop();
      Engine.destroyInstance();
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="bg-black"
        style={{
          imageRendering: "pixelated",
        }}
      />
      <div className="absolute top-4 left-4 text-white font-bold">
        Score: <span id="score">0</span>
      </div>
    </div>
  );
};
