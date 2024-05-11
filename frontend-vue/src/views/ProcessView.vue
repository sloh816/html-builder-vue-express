<script setup>
import WordToHtml from "@/components/forms/WordToHtml.vue";
import InDesignToHtml from "@/components/forms/InDesignToHtml.vue";
</script>

<template>
	<h1 class="page-title">{{ process.name }}</h1>
	<WordToHtml v-if="process.slug === 'word-to-html'" />
	<InDesignToHtml v-if="process.slug === 'indesign-to-html'" />
</template>

<script>
import getProcess from "@/server";

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
		this.allProcesses = await getProcess();
		this.process = this.getProcess();
	},

	methods: {
		getProcess() {
			return this.allProcesses.find((process) => process.slug === this.processSlug);
		}
	}
};
</script>
