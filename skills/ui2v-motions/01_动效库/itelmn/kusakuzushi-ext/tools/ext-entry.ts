import { mount } from "../../../apps/extension/src/content.ts";
import { DEFAULT_CONFIG, Game } from "../../../packages/core/src/index.ts";

declare global {
  interface Window {
    __kz: { mount: typeof mount; DEFAULT_CONFIG: typeof DEFAULT_CONFIG; Game: typeof Game };
  }
}

window.__kz = { mount, DEFAULT_CONFIG, Game };
