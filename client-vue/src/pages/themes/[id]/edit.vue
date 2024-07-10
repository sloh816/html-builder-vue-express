<script setup>
import DisplayThemeForms from "@/components/DisplayThemeForms.vue";
</script>

<template>
	<h1 class="page-title">Edit theme</h1>
	<DisplayThemeForms action="edit" :processId="processId" :themeId="id" />
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
