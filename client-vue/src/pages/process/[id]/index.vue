<script setup>
import WordToHtml from "@/components/forms/WordToHtml.vue";
import InDesignToHtml from "@/components/forms/InDesignToHtml.vue";
import WordToHtmlER from "@/components/forms/WordToHtmlER.vue";
</script>

<template>
	<h1 class="page-title">{{ process.name }}</h1>
	<WordToHtml v-if="id === 'word-to-html'" />
	<InDesignToHtml v-if="id === 'indesign-to-html'" />
	<WordToHtmlER v-if="id === 'word-to-html-easy-read'" />
</template>

<script>
import { getDataById } from "@/server/get";

export default {
	props: ["id"],

	data() {
		return {
			process: {
				name: ""
			}
		};
	},

	async created() {
		this.process = await getDataById("processes", this.id);
	}
};
</script>
