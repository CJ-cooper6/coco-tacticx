import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { Item } from "../types/item";
import { GAME_CONSTANTS } from "../constants";
import { useAnimationStore } from "./animationStore";

export const useItemStore = defineStore("items", () => {
  const animationStore = useAnimationStore();
  const { isAnimationMode, currentFrameElements } = storeToRefs(animationStore);

  const items = ref<Item[]>([]);
  const newDraggingItem = ref<Item | null>(null);
  let nextItemId = 1;

  const addItem = (color: string, x: number, y: number, r: number = GAME_CONSTANTS.DefaultItemRadius) => {
    const item = new Item(color, x, y, r, nextItemId++);
    items.value.push(item);
    return item;
  };

  const moveItem = ({ id, x, y }: { id: number; x: number; y: number }) => {
    const item = items.value.find((p) => p.id === id);
    if (item) {
      item.move(x, y);
    }
  };

  const clearItems = () => {
    items.value = [];
  };

  const deleteItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  // 使用 keyof Item 来限制 property 参数只能是 Item 类型的键
  const setItemProperty = <K extends keyof Item>(id: number, property: K, value: Item[K]) => {
    console.log("setItemProperty", id, property, value);
    // 如果是动画模式，需要更新当前帧的元素
    if (isAnimationMode.value) {
      const itemIndex = currentFrameElements.value.findIndex((p) => p.id === id);
      if (itemIndex !== -1) {
        currentFrameElements.value[itemIndex][property] = value;
      }
    } else {
      const itemIndex = items.value.findIndex((p) => p.id === id);
      if (itemIndex !== -1) {
        items.value[itemIndex][property] = value;
      }
    }
  };

  const setDraggingNewItem = (item: Item | null) => {
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
  const numberColor = (item: Item) => {
    // eslint-disable-next-line no-use-before-define
    const luminance = getLuminance(item.color);
    return luminance > 128 ? "#000000" : "#FFFFFF";
  };

  return {
    items,
    newDraggingItem,
    addItem,
    moveItem,
    clearItems,
    setDraggingNewItem,
    removeDraggingNewItem,
    setItemProperty,
    numberColor,
    deleteItem,
  };
});
