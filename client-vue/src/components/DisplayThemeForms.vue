<script setup>
import WordToHtmlTheme from "@/components/forms/WordToHtmlTheme.vue";
import EasyReadWordToHtmlTheme from "./forms/EasyReadWordToHtmlTheme.vue";

const props = defineProps(["processId", "themeId", "action"]);
</script>

<template>
	<div class="container">
		<WordToHtmlTheme v-if="processId === 'word-to-html'" :themeId="themeId" :action="action" />
		<EasyReadWordToHtmlTheme v-else-if="processId === 'easy-read-word-to-html'" :themeId="themeId" :action="action" />
		<p v-else class="message message--red">No form created for this theme.</p>
	</div>
</template>
