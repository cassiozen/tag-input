import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),

    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["**/*.spec.tsx", "**/*.stories.tsx", "**/*.story.module.css", "**/spec.tsx", "**/stories.tsx"],
      outDir: "dist/types",
      entryRoot: "src",
      tsconfigPath: "tsconfig.app.json",
      staticImport: true,
      logLevel: "info",
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/lib.ts"),
      name: "Lib",
      // the proper extensions will be added
      fileName: "lib",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
