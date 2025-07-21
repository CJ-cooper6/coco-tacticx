import { defineStore } from "pinia";
import { ref } from "vue";
import { FieldElement } from "../types/fieldElement";
import { Drawing } from "../types/drawing";

// 定义操作类型
type OperationType = "add" | "delete" | "update" | "clear" | "";

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
  };

  // 添加新的操作到重做记录
  const pushRedoHistory = (type: OperationType, elements?: FieldElement[], drawings?: Drawing[]) => {
    const historyItem: HistoryItem = {
      type,
      elements: elements?.map((el) => el.clone()),
      drawings: drawings?.map((d) => d.clone()),
      timestamp: Date.now(),
    };
    redoStack.value.push(historyItem);
  };

  const popUndo = () => {
    if (undoStack.value.length === 0) return null;
    return undoStack.value.pop();
  };

  const popRedo = () => {
    if (redoStack.value.length === 0) return null;
    return redoStack.value.pop();
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
    pushRedoHistory,
    popUndo,
    popRedo,
    clearHistory,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
  };
});
