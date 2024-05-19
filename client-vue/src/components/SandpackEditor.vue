<script setup>
import { Sandpack } from "sandpack-vue3";
</script>

<template>
	<Sandpack template="static" theme="dark" :files="files" :options="{ editorHeight: '1000px' }" />
</template>

<script>
import { getThemeStyle } from "@/server.js";

export default {
	name: "SandpackEditor",
	components: {
		Sandpack
	},
	props: {
		indexHtmlCode: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			files: {
				"index.html": {
					code: ""
				},
				"style.css": {
					code: ``
				}
			},
			options: {
				editorHeight: "800px"
			}
		};
	},

	async created() {
		const themeStyles = await getThemeStyle("word-to-html_anrows-ncas");
		this.files["style.css"].code = themeStyles;
		this.files["index.html"].code = this.indexHtmlCode;
	}
};
</script>

<style lang="scss">
.sp-wrapper {
	--sp-layout-height: 1000px !important;
}
</style>
