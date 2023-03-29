/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const { defineConfig } = require("vite");
const wasm = require("vite-plugin-wasm");
const topLevelAwait = require("vite-plugin-top-level-await");

module.exports = defineConfig({
  build: {
    lib: {
      name: "radix-engine-toolkit",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [wasm.default(), topLevelAwait.default()],
});
