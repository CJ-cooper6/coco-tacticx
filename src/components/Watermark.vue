<template>
  <g class="watermark" :opacity="opacity" pointer-events="none">
    <text :x="x" :y="y" text-anchor="middle" dominant-baseline="middle" :font-size="fontSize" :fill="color">
      {{ text }}
    </text>
  </g>
</template>

<script setup lang="ts">
import { GAME_CONSTANTS } from "../constants";

interface Props {
  text?: string;
  opacity?: number;
  size?: number;
  fontSize?: number;
  color?: string;
  rotate?: number;
  x?: number;
  y?: number;
}

const props = withDefaults(defineProps<Props>(), {
  text: GAME_CONSTANTS.showWatermarkText,
  opacity: 0.2,
  size: 400,
  fontSize: 24,
  color: "#000000",
  rotate: 0,
  x: 1190,
  y: 980,
});
</script>
