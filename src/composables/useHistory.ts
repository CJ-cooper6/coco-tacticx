import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useHistoryStore } from "../stores/historyStore";
import { useDrawStore } from "../stores/drawStore";
import { useItemStore } from "../stores/itemStore";

export function useHistory() {
  const itemStore = useItemStore();
  const drawStore = useDrawStore();
  const historyStore = useHistoryStore();

  const { items } = storeToRefs(itemStore);
  const { drawings } = storeToRefs(drawStore);
  const { undoStack, redoStack } = storeToRefs(historyStore);

  // 检查是否可以撤销/重做
  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  // 处理撤销操作
  const handleUndo = () => {
    if (!canUndo.value) return;

    // 在执行撤销之前，保存当前状态到 redoHistory
    historyStore.pushRedoHistory("", itemStore.items.getAll(), drawings.value.getDrawings());

    const lastOperation = historyStore.popUndo();
    if (!lastOperation) return;

    items.value.clear();
    drawings.value.clear();

    if (lastOperation.elements) {
      lastOperation.elements.forEach((el) => items.value.add(el.clone()));
    }

    if (lastOperation.drawings) {
      lastOperation.drawings.forEach((d) => drawings.value.add(d.clone()));
    }
  };

  // 处理重做操作
  const handleRedo = () => {
    if (!canRedo.value) return;

    // 在执行重做之前，保存当前状态到 undoHistory
    historyStore.pushHistory("", itemStore.items.getAll(), drawings.value.getDrawings());

    const nextOperation = historyStore.popRedo();
    if (!nextOperation) return;

    // 清空当前画布并恢复重做状态
    items.value.clear();
    drawings.value.clear();

    if (nextOperation.elements) {
      nextOperation.elements.forEach((el) => items.value.add(el.clone()));
    }

    if (nextOperation.drawings) {
      nextOperation.drawings.forEach((d) => drawings.value.add(d.clone()));
    }
  };

  // 保存当前状态到撤销栈
  const pushHistory = () => {
    historyStore.pushHistory("", itemStore.items.getAll(), drawings.value.getDrawings());
    // 清空重做栈
    redoStack.value = [];
  };

  return {
    handleUndo,
    handleRedo,
    pushHistory,
    canUndo,
    canRedo,
  };
}
