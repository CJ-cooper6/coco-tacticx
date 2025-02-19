export {};

declare global {
  interface Window {
    $debug: typeof debug;
  }
}
