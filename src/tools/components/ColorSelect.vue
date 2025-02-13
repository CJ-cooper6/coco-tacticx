<template>
  <div class="color-container">
    <div class="color-group">
      <div
        v-for="color in colors"
        :key="color"
        class="color-item"
        :class="{ active: shapesConfig.color === color }"
        @click="chooseColor(color)"
      >
        <div class="color-circle" :style="{ backgroundColor: color }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDrawStore } from "@/stores/drawStore";

const drawStore = useDrawStore();
const { shapesConfig } = storeToRefs(drawStore);
const colors = ["#ff0000", "#ffff00", "#5159FF"];

const emit = defineEmits(["changedColor"]);

const chooseColor = (color: string) => {
  shapesConfig.value.color = color;
  emit("changedColor", color);
};
</script>

<style lang="scss" scoped>
.color-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .color-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
  }

  .color-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;

    &.active {
      .color-circle {
        box-shadow:
          0 0 0 2px white,
          0 0 0 4px #00bbbd;
      }
    }

    .color-circle {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
}
</style>
