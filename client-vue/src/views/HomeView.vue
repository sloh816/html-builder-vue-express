<template>
	<h1 class="page-title">Processes</h1>
	<ul>
		<div></div>
		<li v-for="process in processes">
			<RouterLink :to="`/process/${process.slug}`">{{ process.name }}</RouterLink>
		</li>
	</ul>
</template>

<script>
import { RouterLink } from "vue-router";
import { getProcesses } from "@/server";

export default {
	data() {
		return {
			processes: []
		};
	},

	async created() {
		this.processes = await getProcesses();
	}
};
</script>
