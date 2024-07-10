<script setup>
import DisplayThemeForms from "@/components/DisplayThemeForms.vue";
</script>

<template>
	<h1 class="page-title">Create a new theme</h1>
	<DisplayThemeForms action="new" :processId="processId" :themeId="themeId" />
</template>

<script>
import generateId from "@/utils/generateId";

export default {
	data() {
		return {
			processId: "",
			themeId: ""
		};
	},
	created() {
		this.processId = this.$route.query.processId;
		this.themeId = generateId("theme");
	}
};
</script>
