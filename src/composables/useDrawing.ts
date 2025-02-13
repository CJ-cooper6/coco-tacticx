import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useDrawStore } from "../stores/drawStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";

export function useDrawing() {
  const drawStore = useDrawStore();
  const globalStore = useGlobalStore();
  const boardStore = useBoardStore();

  const { svgElement } = storeToRefs(boardStore);
  const { isDrawing } = storeToRefs(globalStore);
  const { newDraggingDrawing, currentTool } = storeToRefs(drawStore);
  const { createTemporaryDrawing, createDrawing } = drawStore;
  const { setDrawStatus } = globalStore;
  const { isOutOfBoardArea } = boardStore;

  const startDrawingPoint = ref({ x: 0, y: 0 });
  let animationFrameId: number | null = null;

  const startDrawing = (event: PointerEvent) => {
    if (!svgElement.value || !(currentTool.value && currentTool.value === "shape")) return;
    if (isOutOfBoardArea(event.clientX, event.clientY)) return;
    event.preventDefault();
    event.stopPropagation();
    setDrawStatus(true);
    const point = svgElement.value.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svgElement.value.getScreenCTM()?.inverse());
    startDrawingPoint.value = { x: svgPoint.x, y: svgPoint.y };
    const newDrawing = createTemporaryDrawing(currentTool.value, svgPoint.x, svgPoint.y, svgPoint.x, svgPoint.y);
    if (newDrawing !== null) {
      newDraggingDrawing.value = newDrawing;
    }
  };

  const moveDrawing = (event: PointerEvent) => {
    if (!svgElement.value || !newDraggingDrawing.value || !isDrawing.value) return;
    event.preventDefault();
    event.stopPropagation();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(() => {
      const point = svgElement.value!.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(svgElement.value!.getScreenCTM()?.inverse());
      newDraggingDrawing.value!.endX = svgPoint.x;
      newDraggingDrawing.value!.endY = svgPoint.y;
    });
  };

  const endDrawing = (event: PointerEvent) => {
    if (!svgElement.value || !isDrawing.value) return;
    event.preventDefault();
    event.stopPropagation();

    if (svgElement.value) {
      svgElement.value.removeEventListener("pointermove", moveDrawing);
      svgElement.value.removeEventListener("pointerup", endDrawing);
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (isOutOfBoardArea(event.clientX, event.clientY)) {
      newDraggingDrawing.value = null;
      setDrawStatus(false);
      return;
    }
    const point = svgElement.value.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svgElement.value.getScreenCTM()?.inverse());
    createDrawing(currentTool.value, startDrawingPoint.value.x, startDrawingPoint.value.y, svgPoint.x, svgPoint.y);
    newDraggingDrawing.value = null;
    setDrawStatus(false);
  };

  return {
    startDrawing,
    moveDrawing,
    endDrawing,
  };
}
