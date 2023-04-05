/// <reference types="vitest" />

import { wasm } from "@rollup/plugin-wasm";
import { defineConfig } from "vite";
import pathe from "pathe";

module.exports = defineConfig({
  build: {
    lib: {
      name: "radix-engine-toolkit",
      entry: pathe.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `index.${format}.js`,
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
