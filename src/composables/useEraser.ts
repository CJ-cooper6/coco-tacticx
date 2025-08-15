import { storeToRefs } from "pinia";
import { useDrawStore } from "../stores/drawStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useHistory } from "./useHistory";
import { isEraserIntersectDrawing } from "@/utils/collision";
import type { Drawing } from "@/types/drawing";

export function useEraser() {
  const drawStore = useDrawStore();
  const globalStore = useGlobalStore();
  const boardStore = useBoardStore();
  const { pushHistory } = useHistory();
  const { currentTool } = storeToRefs(globalStore);
  const { svgElement } = storeToRefs(boardStore);
  const { getSvgPosition } = boardStore;
  const { drawings } = storeToRefs(drawStore);
  const { removeDrawing } = drawStore;

  const beginErasing = (e: PointerEvent) => {
    if (!svgElement.value || currentTool.value !== "eraser") return;
    e.preventDefault();
    e.stopPropagation();

    const point = getSvgPosition(e);

    // 对于橡皮擦，立即开始检测碰撞
    handleEraserCollision(point.x, point.y);

    svgElement.value.addEventListener("pointermove", move);
    svgElement.value.addEventListener("pointerup", end);
  };

  const move = (e: PointerEvent) => {
    if (!svgElement.value) return;
    e.preventDefault();
    e.stopPropagation();
    const point = getSvgPosition(e);
    handleEraserCollision(point.x, point.y);
  };

  const end = (event: PointerEvent) => {
    if (!svgElement.value) return;
    event.preventDefault();
    event.stopPropagation();

    svgElement.value.removeEventListener("pointermove", move);
    svgElement.value.removeEventListener("pointerup", end);
  };

  const handleEraserCollision = (eraserX: number, eraserY: number) => {
    const eraserRadius = 10;
    const drawingsToRemove: Drawing[] = [];

    // 遍历所有绘图对象，检查与橡皮擦的碰撞
    drawings.value.getDrawings().forEach((drawing) => {
      if (isEraserIntersectDrawing(eraserX, eraserY, eraserRadius, drawing)) {
        drawingsToRemove.push(drawing);
      }
    });

    // 删除相交的图形
    if (drawingsToRemove.length > 0) {
      pushHistory();
      drawingsToRemove.forEach((drawing) => {
        removeDrawing(drawing);
      });
    }
  };
  return {
    beginErasing,
    move,
    end,
  };
}
