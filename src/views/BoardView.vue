<template>
  <div class="board">
    <svg
      ref="svgRef"
      id="field"
      width="1250"
      height="826"
      viewBox="0 0 1250 826"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      @pointerdown="startDrawing"
      @dblclick.stop
      class="field"
    >
      <!-- 工具栏区域 -->
      <ToolsPanel />

      <!-- 拖动工具栏区域 -->
      <g id="toolbar-drag" @touchmove.prevent>
        <g id="tools-panel">
          <DragToolsPanel />
        </g>
      </g>
      <g>
        <!-- 球场区域 -->
        <!-- 动态引入球场组件 -->
        <component :is="currentFieldComponent" @touchmove.prevent.stop>
          <!-- 非动画模式 -->
          <template v-if="!isAnimationMode">
            <g id="drawings" v-if="drawings">
              <Drawing v-for="drawing in drawings.getDrawings()" :key="drawing.id" :drawing="drawing" />
            </g>
            <!-- 正在创建的新元素层 -->
            <g id="drawingLayer"></g>
            <!-- 球员 -->
            <g id="players" v-if="normalItems">
              <ItemComponent v-for="item in normalItems" :key="item.id" :item="item" />
            </g>
          </template>
          <!-- 动画模式 -->
          <template v-else>
            <!-- 播放动画时的图层 -->
            <!-- 播放动画是从上一帧位置移动到当前帧位置，所以一开始需要显示上一帧的元素 -->
            <g id="players" v-show="isPlaying">
              <ItemComponent v-for="item in prevFrameElements" :key="item.id" :item="item" />
            </g>
            <template v-if="!isPlaying">
              <!-- 创建动画时的图层 -->
              <!-- 和上一帧之间的曲线路径 -->
              <g id="paths" v-for="item in animationItems" :key="`path-${item.id}`" style="z-index: 1">
                <path
                  v-if="showPath(item)"
                  :d="pathData(item)"
                  stroke="rgba(0,0,0,0.2)"
                  fill="none"
                  stroke-dasharray="5,5"
                  stroke-width="4"
                />
                <!-- 控制点 -->
                <circle
                  v-if="currentFrameIndex !== 0"
                  :cx="pathControlPoint(item)?.x"
                  :cy="pathControlPoint(item)?.y"
                  r="5"
                  fill="red"
                  @pointerdown="startDragControlPoint(item, $event)"
                />
              </g>
              <!-- 上一帧球员 -->
              <g id="prev-frame-elements" style="opacity: 0.5; z-index: 10">
                <ItemComponent v-for="item in haveActionPrevFrameElements" :key="`prev-${item.id}`" :item="item" />
              </g>
              <!-- 球员 -->
              <g id="players">
                <ItemComponent v-for="item in animationItems" :key="item.id" :item="item" />
              </g>
            </template>
          </template>
          <!-- 水印 -->
          <template v-if="showWatermark" #watermark>
            <Watermark />
          </template>
        </component>
      </g>

      <!-- 正在移动的新元素 -->
      <g id="tools-panel">
        <ItemComponent v-if="newDraggingItem" :item="newDraggingItem" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { GAME_CONSTANTS } from "../constants";
// 组件导入
import ItemComponent from "@/components/Item.vue";
import ToolsPanel from "@/components/ToolsPanel.vue";
import DragToolsPanel from "@/components/DragToolsPanel.vue";
import FootballField from "@/components/fields/FootballField.vue";
import Watermark from "@/components/common/Watermark.vue";
import Drawing from "@/components/drawings/Drawing.vue";

// Store 导入
import { useItemStore } from "../stores/itemStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useDrawStore } from "../stores/drawStore";
import { useAnimationStore } from "../stores/animationStore";

// Composables 导入
import { useDrawing } from "../composables/useDrawing";
import { usePath } from "../composables/usePath";

// 组合式函数初始化
const { startDrawing } = useDrawing();
const { showPath, pathData, pathControlPoint, startDragControlPoint } = usePath();

// Store 初始化
const globalStore = useGlobalStore();
const itemStore = useItemStore();
const boardStore = useBoardStore();
const drawStore = useDrawStore();
const animationStore = useAnimationStore();

// Store 状态和方法解构
const { items, newDraggingItem } = storeToRefs(itemStore);
const { drawings } = storeToRefs(drawStore);
const {
  isAnimationMode,
  haveActionPrevFrameElements,
  currentFrameIndex,
  isPlaying,
  currentFrameElements,
  currentAnimation,
} = storeToRefs(animationStore);

const svgRef = ref<SVGSVGElement | null>(null);
const currentFieldType = ref("football");

// 场地组件注册
const fieldComponents: Record<string, Component> = {
  football: FootballField,
  // 在这里添加更多场地类型
};

// 计算属性
const currentFieldComponent = computed(() => fieldComponents[currentFieldType.value]);

const normalItems = computed(() => items.value.findByCreationMode("normal"));

const animationItems = computed(() => currentFrameElements.value);

const prevFrameElements = computed(() => {
  if (currentFrameIndex.value === 0) return currentAnimation.value?.getFrameElements(0);
  return currentAnimation.value?.getFrameElements(currentFrameIndex.value - 1);
});

const showWatermark = GAME_CONSTANTS.showWatermark;

onMounted(() => {
  if (svgRef.value) {
    boardStore.setBoardArea(svgRef.value.getElementById("board-area") as SVGGraphicsElement);
    boardStore.setSvgElement(svgRef.value);
  }
});
</script>

<style scoped>
.app-icon {
  width: 35px;
  height: 35px;
  fill: #64a7a5;
  cursor: pointer;
}

.field {
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
