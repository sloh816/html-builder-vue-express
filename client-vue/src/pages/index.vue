<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
	<h1 class="page-title">What would you like to do?</h1>
	<ul>
		<li v-for="process in processes">
			<RouterLink :to="`/process/${process.slug}`">{{ process.name }}</RouterLink>
		</li>
        <li>
            <RouterLink to="/">Checklists</RouterLink>
        </li>
	</ul>
</template>

<script>
import { getProcesses } from "@/server/get";

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
