/// <reference types="vitest" />

import { wasm } from "@rollup/plugin-wasm";
import { defineConfig } from "vite";
import path from "path";

module.exports = defineConfig({
  build: {
    lib: {
      name: "radix-engine-toolkit",
      entry: path.resolve(__dirname, "src/index.ts"),
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
