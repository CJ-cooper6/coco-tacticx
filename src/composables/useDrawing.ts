/* eslint-disable no-use-before-define */
import { storeToRefs } from "pinia";
import { useDrawStore } from "../stores/drawStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { renderShape } from "@/utils/drawing";

export function useDrawing() {
  const drawStore = useDrawStore();
  const globalStore = useGlobalStore();
  const boardStore = useBoardStore();

  const { svgElement, roughSvg, drawingLayer } = storeToRefs(boardStore);
  const { isDrawing } = storeToRefs(globalStore);
  const { currentTool, drawingConfig } = storeToRefs(drawStore);
  const { createDrawing } = drawStore;
  const { setDrawStatus } = globalStore;
  const { isOutOfBoardArea, getSvgPosition } = boardStore;

  let animationFrameId: number | null = null;
  let startX = 0;
  let startY = 0;
  let pathPoints: [number, number][] = [];

  const startDrawing = (e: PointerEvent) => {
    if (!svgElement.value || ["select"].includes(currentTool.value)) return;
    if (isOutOfBoardArea(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setDrawStatus(true);

    const point = getSvgPosition(e);
    startX = point.x;
    startY = point.y;

    if (drawingConfig.value.type === "pen") {
      pathPoints = [[startX, startY]];
    }

    createTempDrawing(drawingConfig.value.type, point.x, point.y, pathPoints);

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
      if (drawingConfig.value.type === "pen") {
        pathPoints.push([point.x, point.y]);
      }
      updateDrawing(point.x, point.y);
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

    if (isOutOfBoardArea(event)) {
      return;
    }

    const svgPoint = getSvgPosition(event);
    createDrawing(currentTool.value, startX, startY, svgPoint.x, svgPoint.y, pathPoints);
    clearDrawingLayer();
    pathPoints = [];

    svgElement.value.removeEventListener("pointermove", moveDrawing);
    svgElement.value.removeEventListener("pointerup", endDrawing);
  };

  // 创建临时图形
  // eslint-disable-next-line no-shadow
  const createTempDrawing = (type: string, endX: number, endY: number, pathPoints: [number, number][]) => {
    if (!drawingLayer.value || !roughSvg.value) return;

    const renderRoughDrawingVriable = {
      startX,
      startY,
      endX,
      endY,
      pathPoints,
    };
    const styleConfig = {
      strokeColor: drawingConfig.value.strokeColor,
      backgroundColor: drawingConfig.value.backgroundColor,
      size: drawingConfig.value.size,
    };

    const roughElement = renderShape(roughSvg.value, type, renderRoughDrawingVriable, styleConfig);

    if (roughElement) {
      drawingLayer.value.appendChild(roughElement);
    }
  };

  const updateDrawing = (endX: number, endY: number) => {
    if (!roughSvg.value) return;
    clearDrawingLayer();
    createTempDrawing(drawingConfig.value.type, endX, endY, pathPoints);
  };

  const clearDrawingLayer = () => {
    if (!drawingLayer.value) return;
    while (drawingLayer.value.firstChild) {
      drawingLayer.value.removeChild(drawingLayer.value.firstChild);
    }
  };

  return {
    startDrawing,
    moveDrawing,
    endDrawing,
    getSvgPosition,
  };
}
