import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Drawing, DrawingCollection } from "../types/drawing";
import { DEFAULT_TOOL_CONFIG } from "@/constants";

export const useDrawStore = defineStore(
  "draw",
  () => {
    const currentTool = ref("select");
    const drawings = ref(new DrawingCollection());
    const drawingConfig = ref({
      strokeColor: DEFAULT_TOOL_CONFIG.SHAPES.strokeColor,
      backgroundColor: DEFAULT_TOOL_CONFIG.SHAPES.backgroundColor,
      size: DEFAULT_TOOL_CONFIG.SHAPES.size,
      type: DEFAULT_TOOL_CONFIG.SHAPES.shape,
    });

    const setCurrentTool = (tool: string) => {
      currentTool.value = tool;
    };

    const createDrawing = (tool: string, startX: number, startY: number, endX: number, endY: number) => {
      let newDrawing = null;
      if (tool === "shape") {
        newDrawing = new Drawing({
          drawingType: drawingConfig.value.type,
          startX,
          startY,
          endX,
          endY,
          state: "saved",
          strokeColor: drawingConfig.value.strokeColor,
          backgroundColor: drawingConfig.value.backgroundColor,
          size: drawingConfig.value.size,
        });
      }
      if (newDrawing !== null && drawingConfig.value.type === "pen") {
        const drawingLayer = document.getElementById("drawingLayer");
        const penElement = drawingLayer?.lastChild as SVGPathElement;
        const path = penElement.getAttribute("d");
        if (path !== null) {
          newDrawing.pathData = path;
        }
      }
      if (newDrawing !== null) {
        drawings.value.add(newDrawing);
      }
    };

    const clearDrawings = () => {
      drawings.value.clear();
    };

    return {
      currentTool,
      setCurrentTool,
      drawings,
      drawingConfig,
      createDrawing,
      clearDrawings,
    };
  },
  {
    persist: {
      // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/limitations.html
      afterHydrate: (ctx) => {
        if (ctx.store.drawings) {
          const newCollection = new DrawingCollection();
          ctx.store.drawings.getDrawings().forEach((drawing: any) => {
            newCollection.add(new Drawing(drawing));
          });
          ctx.store.drawings = newCollection;
        }
      },
    },
  }
);
