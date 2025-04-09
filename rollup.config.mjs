import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/sparklerlib.cjs.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/sparklerlib.esm.js",
      format: "esm",
    },
  ],
  plugins: [typescript()],
  external: ["pixi.js"],
};
