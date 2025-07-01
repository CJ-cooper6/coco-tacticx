import { storeToRefs } from "pinia";
import { useHistoryStore } from "../stores/historyStore";
import { useItemStore } from "../stores/itemStore";
import { useDrawStore } from "../stores/drawStore";

export function useHistory() {
  const historyStore = useHistoryStore();
  const itemStore = useItemStore();
  const drawStore = useDrawStore();

  const { items } = storeToRefs(itemStore);
  const { drawings } = storeToRefs(drawStore);
  const { undoStack, redoStack } = storeToRefs(historyStore);

  const handleUndo = () => {
    const lastOperation = historyStore.undo();
    if (!lastOperation) return;

    switch (lastOperation.type) {
      case "add":
        if (lastOperation.elements) {
          items.value.clear();
          const prevElements = undoStack.value[undoStack.value.length - 1]?.elements || [];
          prevElements.forEach((el) => items.value.add(el.clone()));
        }
        if (lastOperation.drawings) {
          drawings.value.clear();
          const prevDrawings = undoStack.value[undoStack.value.length - 1]?.drawings || [];
          prevDrawings.forEach((d) => drawings.value.add(d.clone()));
        }
        break;
      case "delete":
        // 重新添加
        if (lastOperation.elements) {
          lastOperation.elements.forEach((el) => items.value.add(el.clone()));
        }
        if (lastOperation.drawings) {
          lastOperation.drawings.forEach((d) => drawings.value.add(d.clone()));
        }
        break;
      case "move":
        // 恢复到之前的位置
        if (lastOperation.elements) {
          items.value.clear();
          lastOperation.elements.forEach((el) => items.value.add(el.clone()));
        }
        break;
      case "clear":
        // 恢复所有元素
        if (lastOperation.elements) {
          lastOperation.elements.forEach((el) => items.value.add(el.clone()));
        }
        if (lastOperation.drawings) {
          lastOperation.drawings.forEach((d) => drawings.value.add(d.clone()));
        }
        break;

      default:
        break;
    }
  };

  const handleRedo = () => {
    const nextOperation = historyStore.redo();
    if (!nextOperation) return;

    switch (nextOperation.type) {
      case "add":
        // 重做添加操作
        if (nextOperation.elements) {
          items.value.clear();
          nextOperation.elements.forEach((el) => items.value.add(el.clone()));
        }
        if (nextOperation.drawings) {
          drawings.value.clear();
          nextOperation.drawings.forEach((d) => drawings.value.add(d.clone()));
        }
        break;
      case "delete":
        // 重做删除操作
        if (nextOperation.elements) {
          items.value.clear();
          const nextElements = redoStack.value[redoStack.value.length - 1]?.elements || [];
          nextElements.forEach((el) => items.value.add(el.clone()));
        }
        if (nextOperation.drawings) {
          drawings.value.clear();
          const nextDrawings = redoStack.value[redoStack.value.length - 1]?.drawings || [];
          nextDrawings.forEach((d) => drawings.value.add(d.clone()));
        }
        break;
      case "move":
        // 重做移动操作
        if (nextOperation.elements) {
          items.value.clear();
          nextOperation.elements.forEach((el) => items.value.add(el.clone()));
        }
        break;
      case "clear":
        // 重做清空操作
        items.value.clear();
        drawings.value.clear();
        break;

      default:
        break;
    }
  };

  const pushHistory = (type: "add" | "delete" | "move" | "clear") => {
    historyStore.pushHistory(type, items.value.getAll(), drawings.value.getDrawings());
  };

  const pushAddHistory = () => {
    pushHistory("add");
  };

  const pushMoveHistory = () => {
    pushHistory("move");
  };

  const pushDeleteHistory = () => {
    pushHistory("delete");
  };

  const pushClearHistory = () => {
    pushHistory("clear");
  };

  return {
    handleUndo,
    handleRedo,
    pushHistory,
    pushAddHistory,
    pushMoveHistory,
    pushDeleteHistory,
    pushClearHistory,
  };
}
