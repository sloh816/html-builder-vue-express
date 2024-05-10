<template>
	<h1>Hello world</h1>
</template>

<script>
import { getThemes, getTheme } from "@/server";

export default {
	name: "editTheme",
	props: ["template", "themeSlug"],

	data() {
		return {
			themeName: "",
			themeData: {}
		};
	},

	async created() {
		// this.theme = await getTheme(`${this.template}_${th}`);
		const themes = await getThemes();
		this.themeName = themes.find((theme) => theme.slug === this.themeSlug).name;
		this.themeData = await getTheme(`${this.template}_${this.themeName}`);
		console.log(this.themeData);
	}
};
</script>
