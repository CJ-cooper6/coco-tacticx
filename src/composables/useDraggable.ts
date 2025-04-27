/* eslint-disable no-param-reassign */
import { storeToRefs } from "pinia";
import { useItemStore } from "../stores/itemStore";
import { useAnimationStore } from "../stores/animationStore";
import { FieldElement } from "../types/fieldElement";
import { clampPosition } from "../utils";
import { useBoardStore } from "../stores/boardStore";

export function useDraggable() {
  const itemStore = useItemStore();
  const animationStore = useAnimationStore();
  const boardStore = useBoardStore();

  const { isAnimationMode } = storeToRefs(animationStore);
  const { moveElement } = itemStore;
  const { svgElement } = storeToRefs(boardStore);

  const startDrag = (item: FieldElement, event: PointerEvent) => {
    const svg = svgElement.value;
    if (!svg) return;

    itemStore.moveItemToLast(item);

    const handleMoveItem = (moveEvent: PointerEvent) => {
      const point = svg.createSVGPoint();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
      const { x, y } = clampPosition(svgPoint.x, svgPoint.y);

      if (item.uuid !== undefined) {
        // todo fix
        // if (isAnimationMode.value) {
        //   animationStore.updateElementPosition(item.id, x, y);
        // } else {
        //   moveElement(item.uuid, x, y);
        // }
        moveElement(item.uuid, x, y);
      }
    };

    const stopDrag = () => {
      if (item.id !== undefined) {
        item.isDragging = false;
      }
      svg.removeEventListener("pointermove", handleMoveItem);
      svg.removeEventListener("pointerup", stopDrag);
      svg.removeEventListener("pointercancel", stopDrag);
    };

    if (item.id !== undefined) {
      item.isDragging = true;
    }
    svg.addEventListener("pointermove", handleMoveItem);
    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
  };
  return {
    startDrag,
  };
}
