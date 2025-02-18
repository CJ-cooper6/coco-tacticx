<!-- eslint-disable vue/no-mutating-props -->
<template>
  <g :id="`item-${item.id}`" ref="itemRef">
    <g
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @click="handleClick"
    >
      <!-- 名称 -->
      <text :x="itemPosition.x" :y="itemPosition.y - item.r - 10" text-anchor="middle" class="player-name">
        {{ item.text }}
      </text>

      <circle
        ref="circleRef"
        :cx="itemPosition.x"
        :cy="itemPosition.y"
        :r="item.r"
        :fill="item.color"
        :stroke="itemStore.numberColor(item)"
        stroke-width="4"
      ></circle>

      <!-- 号码 -->
      <text
        :x="itemPosition.x"
        :y="itemPosition.y"
        text-anchor="middle"
        dominant-baseline="central"
        class="player-number"
        :style="{ fill: itemStore.numberColor(item) }"
        pointer-events="none"
      >
        {{ item.number }}
      </text>
    </g>

    <!-- 弹窗 -->
    <foreignObject class="popup" ref="popupRef" :x="popupX" :y="popupY" width="200" height="210" v-if="showPopup">
      <div xmlns="http://www.w3.org/1999/xhtml" class="popup-content">
        <div class="popup-body">
          <div class="input-group">
            <input type="text" placeholder="号码" v-model="item.number" maxlength="2" />
          </div>
          <div class="input-group">
            <input type="text" placeholder="名称" v-model="item.text" />
          </div>
          <div class="input-group color">
            <input type="color" v-model="item.color" @pointerdown.stop />
          </div>
          <button class="delete-btn" v-if="item.id" @pointerdown="itemStore.deleteItem(item.id)">删除球员</button>
        </div>
      </div>
    </foreignObject>

    <!-- 动画 -->
    <animateMotion
      v-if="circleRef && isPlaying && hasAnimation"
      :path="animationPathData()"
      :dur="frameTime + 's'"
      begin="indefinite"
      fill="freeze"
      ref="animationRef"
    />
  </g>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { type Item } from "../types/item";
import { useBoardStore } from "../stores/boardStore";
import { useAnimationStore } from "../stores/animationStore";
import { useClickOutside } from "../composables/useClickOutside";
import { getCatmullRomPath } from "../utils/path";
import { useItemStore } from "../stores/itemStore";

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
});
const boardStore = useBoardStore();
const { boardAreaBBox } = storeToRefs(boardStore);
const animationStore = useAnimationStore();
const { isPlaying, currentFrameIndex, frameTime } = storeToRefs(animationStore);
const itemStore = useItemStore();

const popupRef = ref(null);
const circleRef = ref(null);
const itemRef = ref(null);
const popupX = ref(200);
const popupY = ref(200);
const showPopup = ref(false);
const animationRef = ref(null);
const isPointerDown = ref(false);
const hasDragged = ref(false);

const emit = defineEmits(["start-drag"]);

const itemPosition = computed(() => {
  if (!isPlaying.value) {
    return { x: props.item.x, y: props.item.y };
  }
  const prevElement = animationStore.prevFrameElement(props.item);
  return prevElement ? { x: prevElement.x, y: prevElement.y } : { x: props.item.x, y: props.item.y };
});

// 当前元素是否有动画
const hasAnimation = computed(() => {
  if (!isPlaying.value) return false;
  const action = animationStore.getElementAnimationAction(props.item.id, currentFrameIndex.value);
  return !!action;
});

const animationPathData = () => {
  const action = animationStore.getElementAnimationAction(props.item.id, currentFrameIndex.value);
  const currentElement = animationStore.getElementInFrame(props.item.id, currentFrameIndex.value);
  if (!currentElement || !action) return "";

  // 使用相对位置生成 Catmull-Rom 样条曲线
  const points = [
    { x: 0, y: 0 }, // 起点（相对坐标）
    { x: action.controlPoint.x - props.item.x, y: action.controlPoint.y - props.item.y },
    { x: currentElement.x - props.item.x, y: currentElement.y - props.item.y }, // 终点（相对坐标）
  ];

  return getCatmullRomPath(points);
};

// 计算弹窗位置, todo: 改造成公共方法
const calculatePopupPosition = () => {
  if (!boardAreaBBox.value) return;
  const svgRect = boardAreaBBox.value;
  const buttonBBox = (circleRef.value as unknown as SVGCircleElement).getBBox();
  const popupBBox = (popupRef.value as unknown as SVGForeignObjectElement).getBBox();
  // 默认右方
  popupX.value = buttonBBox.x + buttonBBox.width + 10;
  popupY.value = buttonBBox.y;
  // 检查是否超出右边
  if (popupX.value + popupBBox.width > svgRect.right) {
    // 尝试左方
    popupX.value = buttonBBox.x - popupBBox.width - 10;
    popupY.value = buttonBBox.y;
  }
};

const handlePointerDown = () => {
  isPointerDown.value = true;
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isPointerDown.value) return;
  emit("start-drag", props.item, event);
  isPointerDown.value = false;
  hasDragged.value = true;
};

const handlePointerUp = () => {
  isPointerDown.value = false;
};

const handleClick = () => {
  if (props.item.isDragging || hasDragged.value) {
    hasDragged.value = false;
    return;
  }
  showPopup.value = !showPopup.value;
  nextTick(() => {
    if (showPopup.value) {
      itemStore.moveItemToLast(props.item);
      calculatePopupPosition();
    }
  });
};

const closePopup = () => {
  showPopup.value = false;
};

useClickOutside({
  targetRef: itemRef,
  onClickOutside: closePopup,
});

watch(
  () => props.item.isDragging,
  (newVal) => {
    if (newVal) {
      showPopup.value = false;
    }
  }
);

watch([isPlaying, currentFrameIndex], ([newIsPlaying, newFrameIndex]) => {
  nextTick(() => {
    if (newIsPlaying && animationRef.value) {
      // @ts-ignore
      animationRef.value.beginElement();
    }
  });
});
</script>

<style lang="scss" scoped>
.popup {
  pointer-events: all;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  overflow: hidden;

  .popup-content {
    height: 100%;
    background: #aedbda;
    border-radius: 12px;
  }

  .popup-body {
    padding: 16px;

    .input-group {
      margin-bottom: 14px;
      display: flex;
      align-items: center;

      label {
        width: 55px;
        color: #4b5563;
        font-size: 14px;
      }

      input {
        padding: 6px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        transition: all 0.2s;
        font-size: 20px;
        width: 100%;
        text-align: center;

        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      }

      &.color {
        input {
          padding: 0;
        }
      }
    }

    .delete-btn {
      width: 100%;
      font-size: 20px;
      padding: 4px 12px;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      background: #66c2be;

      &:hover {
        background: #60a2a2;
      }
    }
  }
}

.player-name {
  fill: #333;
  font-size: 18px;
  user-select: none;
}

.player-number {
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
}
</style>
