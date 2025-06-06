import type { ElementType } from "@/types/fieldElement";

export const GAME_CONSTANTS = {
  showWatermark: true, // 是否显示水印
  showWatermarkText: "Coco战术板 - www.cocotactic.cn", // 水印文本
};

export const ELEMENT_RADIUS_OBJECT: Record<ElementType, number> = {
  player: 24, // 球员
  ball: 13, // 足球
};

// 图标渐变色
export const gradientColor = {
  startColor: "#95e3e1",
  endColor: "#3ca49f",
};

export const DEFAULT_TOOL_CONFIG = {
  SHAPES: { strokeColor: "#1e1e1e", backgroundColor: "transparent", size: 2, shape: "pen" },
};
