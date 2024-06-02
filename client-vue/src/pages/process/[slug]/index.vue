<script setup>
import WordToHtml from "@/components/forms/WordToHtml.vue";
import InDesignToHtml from "@/components/forms/InDesignToHtml.vue";
import WordToHtmlER from "@/components/forms/WordToHtmlER.vue";
</script>

<template>
	<h1 class="page-title">{{ process.name }}</h1>
	<WordToHtml v-if="slug === 'word-to-html'" />
	<InDesignToHtml v-if="slug === 'indesign-to-html'" />
    <WordToHtmlER v-if="slug === 'word-to-html-easy-read'" />
</template>

<script>
// import { getProcess } from "@/server/get";

export default {
	props: ["slug"],

	data() {
		return {
			process: {
                name: '',
                slug: ''
            }
		};
	},

	// async created() {
	// 	this.process = await getProcess(this.slug);
	// }
};
</script>
