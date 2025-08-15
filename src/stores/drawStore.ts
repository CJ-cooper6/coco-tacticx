import { ref } from "vue";
import { defineStore } from "pinia";
import { Drawing, DrawingCollection } from "../types/drawing";
import { DEFAULT_TOOL_CONFIG } from "@/constants";

export const useDrawStore = defineStore(
  "draw",
  () => {
    const drawings = ref(new DrawingCollection());
    const drawingConfig = ref({
      strokeColor: DEFAULT_TOOL_CONFIG.SHAPES.strokeColor,
      backgroundColor: DEFAULT_TOOL_CONFIG.SHAPES.backgroundColor,
      size: DEFAULT_TOOL_CONFIG.SHAPES.size,
      type: DEFAULT_TOOL_CONFIG.SHAPES.shape,
    });

    const createDrawing = (
      tool: string,
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      pathPoints: [number, number][]
    ) => {
      let newDrawing = null;
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
        pathPoints,
      });
      if (newDrawing !== null) {
        drawings.value.add(newDrawing);
      }
    };

    const removeDrawing = (drawingToRemove: Drawing) => {
      const index = drawings.value.getDrawings().findIndex((drawing) => drawing.id === drawingToRemove.id);
      if (index !== -1) {
        drawings.value.getDrawings().splice(index, 1);
      }
    };

    const clearDrawings = () => {
      drawings.value.clear();
    };

    return {
      drawings,
      drawingConfig,
      createDrawing,
      removeDrawing,
      clearDrawings,
    };
  },
  {
    persist: {
      pick: ["drawings"],
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
