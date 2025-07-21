import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { FieldElement, FieldElementCollection } from "../types/fieldElement";
import { useAnimationStore } from "./animationStore";
import { useHistory } from "../composables/useHistory";

export const useItemStore = defineStore(
  "item",
  () => {
    const animationStore = useAnimationStore();
    const { isAnimationMode, currentFrameElements } = storeToRefs(animationStore);
    const { pushHistory } = useHistory();

    const items = ref<FieldElementCollection>(new FieldElementCollection());
    const newDraggingItem = ref<FieldElement | null>(null);

    const addElement = (element: FieldElement) => {
      pushHistory();
      items.value.add(element);
    };

    const moveElement = (identifier: string | number, x: number, y: number) => {
      items.value.move(x, y, identifier);
    };

    const deleteElement = (identifier: string | number) => {
      pushHistory();
      items.value.deleteById(identifier);
    };

    const clearElements = () => {
      pushHistory();
      items.value.clear();
    };

    const setDraggingNewItem = (item: FieldElement | null) => {
      newDraggingItem.value = item;
    };

    const removeDraggingNewItem = () => {
      newDraggingItem.value = null;
    };

    // 计算颜色的亮度
    const getLuminance = (hexColor: string) => {
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      // 计算亮度 (以 YIQ 为基础)
      return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // 决定号码颜色
    const numberColor = (element: FieldElement) => {
      // eslint-disable-next-line no-use-before-define
      const luminance = getLuminance(element.color);
      return luminance > 128 ? "#000000" : "#FFFFFF";
    };

    const moveItemToLast = (element: FieldElement) => {
      // 将点击的元素移动到最后，层级最高
      if (isAnimationMode.value) {
        // 动画模式下，元素数组是计算属性，将元素移动到当前帧的元素数组中的最后可实现层级最高
        const allItems = currentFrameElements.value;
        const index = allItems.findIndex((a) => a.id === element.id);
        if (index !== -1) {
          // 将项目移到数组末尾
          const tmp = allItems.splice(index, 1)[0];
          allItems.push(tmp);
        }
      } else {
        // 非动画模式下，直接将元素移动到最后
        const itemElement = document.getElementById(`item-${element.id}`);
        if (itemElement) {
          const parent = itemElement.parentElement;
          if (parent) {
            parent.appendChild(itemElement);
          }
        }
      }
    };

    return {
      newDraggingItem,
      removeDraggingNewItem,
      numberColor,
      moveItemToLast,
      addElement,
      items,
      setDraggingNewItem,
      moveElement,
      clearElements,
      deleteElement,
    };
  },
  {
    persist: {
      // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/limitations.html
      afterHydrate: (ctx) => {
        // 在 Pinia 恢复状态后，将 items 中的普通对象重新实例化为 FieldElementCollection 类
        if (ctx.store.items) {
          const newCollection = new FieldElementCollection();
          // 遍历并重新实例化每个 FieldElement
          ctx.store.items.getItems().forEach((item: any) => {
            newCollection.add(new FieldElement(item));
          });
          ctx.store.items = newCollection;
        }
      },
    },
  }
);
