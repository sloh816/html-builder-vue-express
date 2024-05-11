<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
	<h1 class="page-title">Processes</h1>
	<ul>
		<li v-for="process in processes">
			<RouterLink :to="`/process/${process.slug}`">{{ process.name }}</RouterLink>
		</li>
	</ul>
</template>

<script>
import getProcess from "@/server";

export default {
	data() {
		return {
			processes: []
		};
	},

	async created() {
		this.processes = await getProcess();
	}
};
</script>
