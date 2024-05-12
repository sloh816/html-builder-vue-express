<script setup>
import WordToHtml from "@/components/forms/WordToHtml.vue";
import InDesignToHtml from "@/components/forms/InDesignToHtml.vue";
</script>

<template>
	<h1 class="page-title">{{ process.name }}</h1>
	<WordToHtml v-if="processSlug === 'word-to-html'" />
	<InDesignToHtml v-if="processSlug === 'indesign-to-html'" />
</template>

<script>
import { getProcesses } from "@/server";

export default {
	name: "Process",
	props: ["processSlug"],

	data() {
		return {
			allProcesses: [],
			process: {}
		};
	},

	async created() {
		this.allProcesses = await getProcesses();
		this.process = this.getProcess();
	},

	methods: {
		getProcess() {
			return this.allProcesses.find((process) => process.slug === this.processSlug);
		}
	}
};
</script>
