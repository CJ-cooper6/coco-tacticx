import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Drawing } from "../types/drawing";
import { DEFAULT_TOOL_CONFIG } from "@/constants";

export const useDrawStore = defineStore("draw", () => {
  const currentTool = ref("select");
  const drawings = ref<Drawing[]>([]);
  const shapesConfig = reactive({
    strokeColor: DEFAULT_TOOL_CONFIG.SHAPES.strokeColor,
    backgroundColor: DEFAULT_TOOL_CONFIG.SHAPES.backgroundColor,
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
        shapesConfig.strokeColor,
        shapesConfig.backgroundColor,
        shapesConfig.size
      );
    }
    if (newDrawing !== null) {
      drawings.value.push(newDrawing);
    }
  };

  return {
    currentTool,
    setCurrentTool,
    drawings,
    shapesConfig,
    createDrawing,
  };
});
