import { ref } from "vue";

export interface DebugMessage {
  time: string;
  type: "log" | "warn" | "error" | "success";
  message: any;
}

class DebugBus {
  private static instance: any;

  messages = ref<DebugMessage[]>([]);

  static getInstance() {
    if (!this.instance) {
      this.instance = new DebugBus();
    }
    return this.instance;
  }

  send(message: any, type: DebugMessage["type"] = "log") {
    this.messages.value.unshift({
      time: new Date().toLocaleTimeString(),
      type,
      message,
    });
  }

  clear() {
    this.messages.value = [];
  }
}

export const debugBus = DebugBus.getInstance();

export const debug = {
  log: (msg: any) => debugBus.send(msg, "log"),
  warn: (msg: any) => debugBus.send(msg, "warn"),
  error: (msg: any) => debugBus.send(msg, "error"),
  success: (msg: any) => debugBus.send(msg, "success"),
  clear: () => debugBus.clear(),
};
