<script setup>
import DataDisplay from "@/components/DataDisplay.vue";
import Button from "@/components/Button.vue";
</script>

<template>
	<h1 class="page-title">Publication Details</h1>
	<div class="container">
		<div class="publication-id">
			<p><strong>Publication ID:</strong></p>
			<p>{{ publicationId }}</p>
		</div>
		<DataDisplay :data="publicationData" flex="flex-row" />
		<Button :href="`/publications/${id}/preview`" class="secondary">View HTML</Button>
	</div>
</template>

<script>
import { getDataById } from "@/server/get";
export default {
	props: ["id"],

	data() {
		return {
			publicationData: {},
			publicationId: null
		};
	},

	async created() {
		const publicationData = await getDataById("publications", `${this.id}`);
		const themeData = await getDataById("themes", publicationData.themeId);
		const processData = await getDataById("processes", publicationData.processId);

		this.publicationId = publicationData.id;

		this.publicationData = {
			"Date created": publicationData.date,
			"Time created": publicationData.time,
			Process: processData.name,
			Theme: themeData.name
		};
	}
};
</script>
