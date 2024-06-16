<script setup>
import FileInput from "@/components/formComponents/FileInput.vue";
import Button from "@/components/Button.vue";
import SelectInput from "@/components/formComponents/SelectInput.vue";
</script>

<template>
	<form class="container">
		<FileInput label="Upload an Easy Read Word document:" name="EasyReadWordFile" />
		<SelectInput :options="themeOptions" name="theme" label="Select a theme: " />
		<Button class="primary text-m" type="submit">Submit</Button>
	</form>
</template>

<script>
import { getData } from "@/server/get";

export default {
	data() {
		return {
			themeOptions: []
		};
	},

	async created() {
		const themes = await getData("themes");
		const easyReadWordToHtml = themes.filter((theme) => theme.processId === "easy-read-word-to-html");
		easyReadWordToHtml.forEach((theme) => {
			this.themeOptions.push({
				name: theme.name,
				value: theme.name,
				key: theme.slug
			});
		});
	}
};
</script>
