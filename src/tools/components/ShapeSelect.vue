<template>
  <div class="shape-container">
    <div class="shape-group">
      <div
        v-for="shape in shapes"
        :key="shape"
        class="shape-item"
        :class="{ active: shapesConfig.shape === shape }"
        @click="chooseShape(shape)"
      >
        <SvgIcon :name="shape" class="svg-icon"></SvgIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDrawStore } from "@/stores/drawStore";
import SvgIcon from "@/components/SvgIcon.vue";

const drawStore = useDrawStore();

const { shapesConfig } = storeToRefs(drawStore);

const shapes = ["rectangle", "circle"];

const emit = defineEmits(["changedShape"]);

const chooseShape = (shape: string) => {
  shapesConfig.value.shape = shape;
  emit("changedShape", shape);
};
</script>

<style lang="scss" scoped>
.shape-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .shape-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
  }

  .shape-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: black;

    .svg-icon {
      width: 2rem;
      height: 2rem;
    }

    &.active {
      color: #00bbbd;
    }
  }
}
</style>
