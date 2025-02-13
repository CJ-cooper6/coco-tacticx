import { storeToRefs } from "pinia";
import { GAME_CONSTANTS } from "../constants";
import { useBoardStore } from "../stores/boardStore";
import pinia from "../stores/index.js";

const boardStore = useBoardStore(pinia);
const { boardAreaBBox } = storeToRefs(boardStore);

// 辅助函数：计算边界
const calculateBounds = () => {
  if (!boardAreaBBox.value) {
    return null;
  }
  const { left, right, top, bottom } = boardAreaBBox.value;
  const radius = GAME_CONSTANTS.DefaultItemRadius;
  return {
    minX: left + radius,
    maxX: right - radius,
    minY: top + radius,
    maxY: bottom - radius,
  };
};

// 边界检查，球员的移动将被限制在战术板内
export const clampPosition = (x: number, y: number) => {
  const bounds = calculateBounds();
  if (!bounds) {
    return { x, y };
  }
  const { minX, maxX, minY, maxY } = bounds;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
};

// 判断坐标是否在战术板内
export const isInsideField = (x: number, y: number) => {
  const bounds = calculateBounds();
  if (!bounds) {
    return false;
  }
  const { minX, maxX, minY, maxY } = bounds;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};
