import { storeToRefs } from "pinia";
import { useItemStore } from "../stores/itemStore";
import { useAnimationStore } from "../stores/animationStore";
import { Item } from "../types/item";
import { clampPosition } from "../utils";
import { useBoardStore } from "../stores/boardStore";

export function useDraggable() {
  const itemStore = useItemStore();
  const animationStore = useAnimationStore();
  const boardStore = useBoardStore();

  const { isAnimationMode, currentFrameElements } = storeToRefs(animationStore);
  const { setItemProperty, moveItem } = itemStore;
  const { svgElement } = storeToRefs(boardStore);

  const startDrag = (item: Item, event: PointerEvent) => {
    const svg = svgElement.value;
    if (!svg) return;

    const handleMoveItem = (moveEvent: PointerEvent) => {
      const point = svg.createSVGPoint();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
      const { x, y } = clampPosition(svgPoint.x, svgPoint.y);

      if (item.id !== undefined) {
        if (isAnimationMode.value) {
          animationStore.updateElementPosition(item.id, x, y);
        } else {
          moveItem({ id: item.id, x, y });
        }
      }
    };

    const stopDrag = () => {
      if (item.id !== undefined) {
        setItemProperty(item.id, "isDragging", false);
      }
      svg.removeEventListener("pointermove", handleMoveItem);
      svg.removeEventListener("pointerup", stopDrag);
      svg.removeEventListener("pointercancel", stopDrag);
    };

    if (item.id !== undefined) {
      setItemProperty(item.id, "isDragging", true);
    }
    svg.addEventListener("pointermove", handleMoveItem);
    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
  };
  return {
    startDrag,
  };
}
