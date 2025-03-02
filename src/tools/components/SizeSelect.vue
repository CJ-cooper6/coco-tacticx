<template>
  <div class="size-container">
    <div class="size-group">
      <div
        v-for="size in sizes"
        :key="size"
        class="size-item"
        :class="{ active: shapesConfig.size === size }"
        @click="chooseSize(size)"
      >
        <div class="size-circle" :style="{ width: size + 'px', height: size + 'px' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDrawStore } from "@/stores/drawStore";

const drawStore = useDrawStore();
const { shapesConfig } = storeToRefs(drawStore);
const sizes = [2, 5, 10];

const emit = defineEmits(["changed"]);

const chooseSize = (size: number) => {
  shapesConfig.value.size = size;
  emit("changed", size);
};
</script>

<style lang="scss" scoped>
.size-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .size-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
  }

  .size-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease;

    &.active {
      .size-circle {
        box-shadow:
          0 0 0 0.1rem white,
          0 0 0 0.2rem #00bbbd;
      }
    }

    .size-circle {
      background-color: black;
      border-radius: 50%;
    }
  }
}
</style>
