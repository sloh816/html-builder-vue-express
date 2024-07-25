<script setup>
import { onMounted, ref } from "vue";
import WordToHtml from "@/components/forms/WordToHtml.vue";
import InDesignToHtml from "@/components/forms/InDesignToHtml.vue";
import WordToHtmlER from "@/components/forms/EasyReadWordToHtml.vue";
import { getDataById } from "@/server/get";

const props = defineProps(["id"]);

const process = ref({ name: "" });
onMounted( async () => {
    process.value = await getDataById("processes", props.id);
})
</script>

<template>
	<h1 class="page-title">{{ process.name }}</h1>
	<WordToHtml v-if="id === 'word-to-html'" />
	<InDesignToHtml v-if="id === 'indesign-to-html'" />
	<WordToHtmlER v-if="id === 'easy-read-word-to-html'" />
</template>
