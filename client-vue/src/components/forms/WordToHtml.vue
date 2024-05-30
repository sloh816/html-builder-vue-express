<script setup>
import FileInput from "@/components/formComponents/FileInput.vue";
import Button from "@/components/Button.vue";
import SelectInput from "@/components/formComponents/SelectInput.vue";
</script>

<template>
	<form v-if="!isProcessing" enctype="multipart/form-data" @submit.prevent="sendForm" class="container">
		<p v-if="errorMessage" class="message">{{ errorMessage }}</p>
		<FileInput label="Upload a Word Document:" name="wordFile" @onFileUpload="handleFileUpload" />
		<SelectInput :options="themes" name="theme" />
		<Button class="primary text-m" type="submit">Submit</Button>
	</form>
	<div v-else-if="isProcessing" class="container process-messages">
		<p class="message message--green">Form data submitted !</p>
		<p class="message message--yellow">Converting Word document to HTML...</p>
		<div v-if="processSuccess" class="process-messages__success">
			<p class="message message--green">Successfully converted Word document to HTML !</p>
			<Button class="secondary left" href="/publications">See Publication</Button>
		</div>
	</div>
</template>

<script>
import { sendWordToHtmlForm } from "@/server/post";
import { getThemesData } from "@/server/get";

export default {
	name: "wordToHtml",

	data() {
		return {
			wordFile: "",
			errorMessage: "",
			themes: [],
			isProcessing: false,
			processSuccess: false
		};
	},

	async created() {
		const themesData = await getThemesData("word-to-html");
		themesData.forEach((theme) => {
			this.themes.push({
				name: theme.themeName,
				value: theme.slug,
				key: theme.slug
			});
		});
	},

	methods: {
		handleFileUpload(file) {
			// store the upload word file to the wordFile variable.
			this.wordFile = file;
		},

		async sendForm(event) {
			if (this.wordFile) {
				this.isProcessing = true;

				const formData = new FormData();
				formData.append("wordFile", this.wordFile);
				formData.append("theme", event.target.theme.value);

				this.errorMessage = "";
				this.processSuccess = await sendWordToHtmlForm(formData);
			} else {
				this.errorMessage = "Please upload a file";
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.process-messages,
.process-messages__success {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
