/* eslint-disable no-use-before-define */
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { useDrawStore } from "../stores/drawStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useAnimationStore } from "../stores/animationStore";
import { useHistory } from "./useHistory";
import { renderShape } from "@/utils/drawing";

export function useDrawing() {
  const drawStore = useDrawStore();
  const globalStore = useGlobalStore();
  const boardStore = useBoardStore();
  const animationStore = useAnimationStore();
  const { pushHistory } = useHistory();

  const { svgElement, roughSvg, drawingLayer } = storeToRefs(boardStore);
  const { isDrawing, currentTool } = storeToRefs(globalStore);
  const { isAnimationMode } = storeToRefs(animationStore);
  const { drawingConfig } = storeToRefs(drawStore);
  const { createDrawing } = drawStore;
  const { setDrawStatus } = globalStore;
  const { isOutOfBoardArea, getSvgPosition } = boardStore;
  const { addDrawingToFrame } = animationStore;

  let animationFrameId: number | null = null;
  let startX = 0;
  let startY = 0;
  let pathPoints: [number, number][] = [];

  const startDrawing = (e: PointerEvent) => {
    if (!svgElement.value || ["select"].includes(currentTool.value)) return;
    if (isOutOfBoardArea(e, 0)) return;
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

    // 检查鼠标是否移出了战术区域
    if (isOutOfBoardArea(e, 0)) {
      // 如果移出了战术区域，取消绘制
      cancelDrawing();
      return;
    }

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

    if (isOutOfBoardArea(event, 0)) {
      return;
    }

    const svgPoint = getSvgPosition(event);
    pushHistory();

    const newDrawing = {
      id: Date.now().toString(),
      startX,
      startY,
      endX: svgPoint.x,
      endY: svgPoint.y,
      strokeColor: drawingConfig.value.strokeColor,
      backgroundColor: drawingConfig.value.backgroundColor,
      size: drawingConfig.value.size,
      pathPoints: [...pathPoints],
      drawingType: drawingConfig.value.type,
      type: "drawing",
      state: "saved",
      creationMode: "animation",
    };

    if (isAnimationMode.value) {
      addDrawingToFrame(newDrawing);
    } else {
      createDrawing(currentTool.value, startX, startY, svgPoint.x, svgPoint.y, pathPoints);
    }

    clearDrawingLayer();
    pathPoints = [];

    svgElement.value.removeEventListener("pointermove", moveDrawing);
    svgElement.value.removeEventListener("pointerup", endDrawing);
  };

  // 取消绘制
  const cancelDrawing = () => {
    if (!svgElement.value || !isDrawing.value) return;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    setDrawStatus(false);
    clearDrawingLayer();
    pathPoints = [];

    // 移除事件监听器
    svgElement.value.removeEventListener("pointermove", moveDrawing);
    svgElement.value.removeEventListener("pointerup", endDrawing);

    // 显示提示信息
    ElMessage({
      message: "请在战术区域内进行绘制",
      type: "warning",
      duration: 2000,
    });
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
    cancelDrawing,
    getSvgPosition,
  };
}
