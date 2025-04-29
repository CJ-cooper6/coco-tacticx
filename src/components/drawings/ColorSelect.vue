<template>
  <div class="color-container">
    <div class="color-group">
      <div
        v-for="(color, index) in presetColors"
        :key="index"
        class="color-item"
        @click.stop="choosePresetColor(color as string)"
      >
        <div
          class="color-circle"
          :class="{ active: selectColor === color, 'is-transparent': color === 'transparent' }"
          :style="{ backgroundColor: color as string }"
        ></div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="custom-color">
      <label
        for="colorPicker"
        class="select-color"
        :class="{ 'is-transparent': selectColor === 'transparent' }"
        :style="{ background: selectColor }"
      ></label>
      <input id="colorPicker" type="color" :value="selectColor" @input="updateColor" class="color-picker" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  presetColors: {
    type: Array,
    required: true,
  },
  defaultSelectColor: {
    type: String,
    required: true,
  },
});

const selectColor = ref(props.defaultSelectColor);

const emit = defineEmits(["change-color"]);

const choosePresetColor = (color: string) => {
  selectColor.value = color;
};

const updateColor = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectColor.value = target.value;
};

watch(selectColor, (newColor) => {
  emit("change-color", newColor);
});
</script>

<style lang="scss" scoped>
.color-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;

  .color-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 70%;
  }

  .divider {
    width: 0.1rem;
    height: 2rem;
    background-color: var(--default-border-color);
    margin: 0px auto;
  }

  .custom-color {
    position: relative;
    width: 2rem;
    height: 2rem;
  }

  .color-item {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--text-dark-color);

    .color-circle {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
  .color-picker {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  .select-color {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
    display: block;
  }

  .is-transparent {
    background: none !important;
    background-image: url("/is-transparent.png") !important;
    box-shadow: inset 0 0 0 1px #d9d9d9;
  }
}
</style>
