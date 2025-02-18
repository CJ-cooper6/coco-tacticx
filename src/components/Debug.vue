<template>
  <div class="debug-panel" :class="{ open: isOpen }">
    <div class="debug-trigger" @click="isOpen = !isOpen">Debug ({{ messages.length }})</div>
    <div v-show="isOpen" class="debug-content">
      <div class="debug-header">
        <span>调试信息</span>
        <div class="debug-header-buttons">
          <button @click="isOpen = !isOpen">收起</button>
          <button @click="debug.clear">清空</button>
        </div>
      </div>
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <span class="time">{{ msg.time }}</span>
          <pre class="content">{{ formatMessage(msg.message) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { debugBus, debug } from "../utils/debugBus";

const isOpen = ref(false);
const { messages } = debugBus;

const formatMessage = (msg: any) => {
  if (typeof msg === "object") {
    return JSON.stringify(msg, null, 2);
  }
  return String(msg);
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: #1a1a1a;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.debug-trigger {
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
}

.debug-content {
  width: 300px;
  max-height: 50vh;
  overflow-y: auto;
  border-top: 1px solid #333;
  touch-action: pan-y;
  overscroll-behavior: contain;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #2a2a2a;

  .debug-header-buttons {
    display: flex;
    gap: 8px;
  }
}

.debug-header button {
  padding: 4px 8px;
  background: #444;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.messages {
  padding: 8px;
}

.message {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  background: #2a2a2a;
}

.time {
  font-size: 12px;
  color: #888;
}

.content {
  margin: 4px 0 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
}

.log {
  border-left: 3px solid #4caf50;
}
.warn {
  border-left: 3px solid #ffc107;
}
.error {
  border-left: 3px solid #f44336;
}
.success {
  border-left: 3px solid #2196f3;
}
</style>
