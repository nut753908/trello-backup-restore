import terser from "@rollup/plugin-terser";

export default ["index", "restore", "authorize", "settings"].map((n) => ({
  input: `js/${n}.js`,
  output: {
    file: `public/js/${n}.min.js`,
    format: "es",
  },
  plugins: [terser()],
}));
