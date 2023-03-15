import path from "path";
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import sass from "sass"

// Get the VITE_PORT from the dotenv file
const env = loadEnv("development", process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: parseInt(env.VITE_PORT),
    base: env.VITE_BASE_URL,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/variables.scss";`,
      },
    },
  },
  build: {
    outDir: './html' 
  }
});
