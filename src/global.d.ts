declare module "*.wasm" {
  const content: (
    options: WebAssembly.Imports
  ) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;
  export default content;
}
