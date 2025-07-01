import { defineStore } from "pinia";
import { ref } from "vue";
import { FieldElement } from "../types/fieldElement";
import { Drawing } from "../types/drawing";

// 定义操作类型
type OperationType = "add" | "delete" | "move" | "clear";

// 定义历史记录项的接口
interface HistoryItem {
  type: OperationType;
  elements?: FieldElement[];
  drawings?: Drawing[];
  timestamp: number;
}

export const useHistoryStore = defineStore("history", () => {
  const undoStack = ref<HistoryItem[]>([]);
  const redoStack = ref<HistoryItem[]>([]);

  // 添加新的操作到历史记录
  const pushHistory = (type: OperationType, elements?: FieldElement[], drawings?: Drawing[]) => {
    const historyItem: HistoryItem = {
      type,
      elements: elements?.map((el) => el.clone()),
      drawings: drawings?.map((d) => d.clone()),
      timestamp: Date.now(),
    };

    undoStack.value.push(historyItem);
    // 清空重做栈
    redoStack.value = [];
  };

  // 撤销操作
  const undo = () => {
    if (undoStack.value.length === 0) return null;

    const lastOperation = undoStack.value.pop();
    if (lastOperation) {
      redoStack.value.push(lastOperation);
      return lastOperation;
    }
    return null;
  };

  // 重做操作
  const redo = () => {
    if (redoStack.value.length === 0) return null;

    const nextOperation = redoStack.value.pop();
    if (nextOperation) {
      undoStack.value.push(nextOperation);
      return nextOperation;
    }
    return null;
  };

  // 清空历史记录
  const clearHistory = () => {
    undoStack.value = [];
    redoStack.value = [];
  };

  // 检查是否可以撤销/重做
  const canUndo = () => undoStack.value.length > 0;
  const canRedo = () => redoStack.value.length > 0;

  return {
    pushHistory,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
  };
});
