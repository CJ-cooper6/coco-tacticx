<template>
  <!-- 渐变SVG -->
  <svg aria-hidden="true">
    <!-- 添加渐变定义 -->
    <defs>
      <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :style="{ 'stop-color': startColor }" />
        <stop offset="100%" :style="{ 'stop-color': endColor }" />
      </linearGradient>
    </defs>
    <use :xlink:href="symbolId" :fill="`url(#${gradientId})`" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  // 添加渐变色属性
  startColor: {
    type: String,
    default: "currentColor",
  },
  endColor: {
    type: String,
    default: "currentColor",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
// 为每个图标生成唯一的渐变ID
const gradientId = computed(() => `gradient-${props.name}`);
</script>
