import type { Plugin } from "../core/src/types"; // adjust once types exist
export const pluginReact: Plugin = {
  async detect() { return false; },
  async inject() { /* no-op */ },
};
export default pluginReact;
