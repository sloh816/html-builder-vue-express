import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pages from 'vite-plugin-pages'
import layouts from 'vite-plugin-vue-layouts'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), pages(), layouts()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	server: {
		proxy: {
			"/api": "http://localhost:3000"
		}
	},
});
