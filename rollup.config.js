import terser from "@rollup/plugin-terser";

export default [
  "index",
  "restore",
  "restore-firefox",
  "authorize",
  "settings",
].map((n) => ({
  input: `js/${n}.js`,
  output: {
    file: `public/${n}.min.js`,
    format: "es",
  },
  plugins: [terser()],
}));
