/// <reference types="vitest" />

import { wasm } from "@rollup/plugin-wasm";
import pathe from "pathe";
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    lib: {
      name: "radix-engine-toolkit",
      entry: pathe.resolve(__dirname, "src/index.ts"),
    },
  },
  plugins: [wasm({ targetEnv: "auto-inline" })],
  test: {
    globals: true,
    environment: "happy-dom",
    deps: {
      interopDefault: true,
    },
    exclude: ["examples", "node_modules"],
  },
});
