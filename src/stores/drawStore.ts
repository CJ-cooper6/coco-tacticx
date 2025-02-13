import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Drawing } from "../types/drawing";
import { DEFAULT_TOOL_CONFIG } from "@/constants";

export const useDrawStore = defineStore("draw", () => {
  const currentTool = ref("select");
  const drawings = ref<Drawing[]>([]);
  const newDraggingDrawing = ref<Drawing | null>(null);
  const shapesConfig = reactive({
    color: DEFAULT_TOOL_CONFIG.SHAPES.color,
    size: DEFAULT_TOOL_CONFIG.SHAPES.size,
    shape: DEFAULT_TOOL_CONFIG.SHAPES.shape,
  });

  const setCurrentTool = (tool: string) => {
    currentTool.value = tool;
  };

  const createDrawing = (tool: string, startX: number, startY: number, endX: number, endY: number) => {
    let newDrawing = null;
    if (tool === "shape") {
      newDrawing = new Drawing(
        shapesConfig.shape,
        startX,
        startY,
        endX,
        endY,
        "saved",
        shapesConfig.color,
        shapesConfig.size
      );
    }
    if (newDrawing !== null) {
      drawings.value.push(newDrawing);
    }
  };

  const createTemporaryDrawing = (tool: string, startX: number, startY: number, endX: number, endY: number) => {
    if (tool === "shape") {
      return new Drawing(
        shapesConfig.shape,
        startX,
        startY,
        endX,
        endY,
        "temporary",
        shapesConfig.color,
        shapesConfig.size
      );
    }
    return null;
  };

  return {
    currentTool,
    setCurrentTool,
    drawings,
    newDraggingDrawing,
    shapesConfig,
    createDrawing,
    createTemporaryDrawing,
  };
});
