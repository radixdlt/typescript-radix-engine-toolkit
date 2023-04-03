/// <reference types="vitest" />

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const wasm = require("@rollup/plugin-wasm");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      name: "radix-engine-toolkit",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `index.${format}.js`,
    },
    assetsInlineLimit: 1048576,
  },
  plugins: [wasm.default({ targetEnv: "auto-inline" })],
  test: {
    globals: true,
    environment: "happy-dom",
    deps: {
      interopDefault: true,
    },
  },
});
