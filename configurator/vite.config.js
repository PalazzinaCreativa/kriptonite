import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";
import Pages from 'vite-plugin-pages';
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
/* export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  }
}) */

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  
  return defineConfig({
    plugins: [vue(), Pages({
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
      ],
    })],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    }
  });
}
