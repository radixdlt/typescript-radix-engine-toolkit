declare module "*.wasm" {
  const content: ({}) => WebAssembly.WebAssemblyInstantiatedSource;
  export default content;
}
