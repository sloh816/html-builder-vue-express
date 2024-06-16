<script setup>
import WordToHtmlTheme from "@/components/forms/WordToHtmlTheme.vue";
</script>

<template>
	<h1 class="page-title">Edit theme</h1>
	<div class="container">
		<WordToHtmlTheme v-if="processId === 'word-to-html'" :themeId="id" />
		<p v-else class="message message--red">No form created for this theme.</p>
	</div>
</template>

<script>
import { getDataById } from "@/server/get";

export default {
	props: ["id"],

	data() {
		return {
			processId: "",
			displayData: {}
		};
	},

	async created() {
		const theme = await getDataById("themes", this.id);
		this.processId = theme.processId;
	}
};
</script>
