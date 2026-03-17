import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["src/styles"],
        silenceDeprecations: ["color-functions", "global-builtin", "import"],
      },
    },
  },
});
