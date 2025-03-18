/* eslint-disable no-use-before-define */
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { useDrawStore } from "../stores/drawStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";

export function useDrawing() {
  const drawStore = useDrawStore();
  const globalStore = useGlobalStore();
  const boardStore = useBoardStore();

  const { svgElement } = storeToRefs(boardStore);
  const { isDrawing } = storeToRefs(globalStore);
  const { currentTool, shapesConfig } = storeToRefs(drawStore);
  const { createDrawing } = drawStore;
  const { setDrawStatus } = globalStore;
  const { isOutOfBoardArea, getSvgPosition } = boardStore;
  const { roughSvg, drawingLayer } = storeToRefs(boardStore);

  let animationFrameId: number | null = null;
  let startX = 0;
  let startY = 0;

  // 创建临时图形
  const createShape = (type: string, endX: number, endY: number) => {
    if (!drawingLayer.value || !roughSvg.value) return null;
    const color = shapesConfig.value.color;
    const size = shapesConfig.value.size;
    switch (type) {
      case "rectangle": {
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const roughElement = roughSvg.value.rectangle(x, y, width, height, {
          roughness: 1.5,
          stroke: color,
          strokeWidth: size,
          fill: "none",
          seed: 1,
        });
        drawingLayer.value.appendChild(roughElement);
        return roughElement;
      }
      case "ellipse": {
        // 椭圆
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const left = Math.min(startX, endX);
        const top = Math.min(startY, endY);
        const x = left + width / 2;
        const y = top + height / 2;
        const roughElement = roughSvg.value.ellipse(x, y, width, height, {
          roughness: 1.5,
          stroke: color,
          strokeWidth: size,
          fill: "none",
          seed: 1,
        });
        drawingLayer.value.appendChild(roughElement);
        return roughElement;
      }
      default:
        return null;
    }
  };

  const updateShape = (endX: number, endY: number) => {
    if (!roughSvg.value) return;
    clearDrawingLayer();
    createShape(shapesConfig.value.shape, endX, endY);
  };

  const clearDrawingLayer = () => {
    if (!drawingLayer.value) return;
    while (drawingLayer.value.firstChild) {
      drawingLayer.value.removeChild(drawingLayer.value.firstChild);
    }
  };

  const startDrawing = (e: PointerEvent) => {
    if (!svgElement.value || ["select"].includes(currentTool.value)) return;
    if (isOutOfBoardArea(e.clientX, e.clientY)) return;
    e.preventDefault();
    e.stopPropagation();
    setDrawStatus(true);

    const point = getSvgPosition(e);
    startX = point.x;
    startY = point.y;
    createShape(shapesConfig.value.shape, point.x, point.y);

    svgElement.value.addEventListener("pointermove", moveDrawing);
    svgElement.value.addEventListener("pointerup", endDrawing);
  };

  const moveDrawing = (e: PointerEvent) => {
    if (!svgElement.value || !isDrawing.value) return;
    e.preventDefault();
    e.stopPropagation();

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(() => {
      const point = getSvgPosition(e);
      updateShape(point.x, point.y);
    });
  };

  const endDrawing = (event: PointerEvent) => {
    if (!svgElement.value || !isDrawing.value) return;
    event.preventDefault();
    event.stopPropagation();

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    setDrawStatus(false);

    if (isOutOfBoardArea(event.clientX, event.clientY)) {
      return;
    }

    const svgPoint = getSvgPosition(event);
    createDrawing(currentTool.value, startX, startY, svgPoint.x, svgPoint.y);
    clearDrawingLayer();

    svgElement.value.removeEventListener("pointermove", moveDrawing);
    svgElement.value.removeEventListener("pointerup", endDrawing);
  };

  return {
    startDrawing,
    moveDrawing,
    endDrawing,
    getSvgPosition,
  };
}
