<script setup>
import FileInput from "@/components/formComponents/FileInput.vue";
import Button from "@/components/Button.vue";
import SelectInput from "@/components/formComponents/SelectInput.vue";
</script>

<template>
	<form enctype="multipart/form-data" @submit.prevent="sendForm">
		<p v-if="errorMessage" class="message">{{ errorMessage }}</p>
		<FileInput label="Upload a Word Document:" name="wordFile" @onFileUpload="handleFileUpload" />
		<SelectInput :options="themes" name="theme" />
		<Button class="primary text-m" type="submit">Submit</Button>
		<p v-if="message" class="message message--success">{{ message }}</p>
	</form>
</template>

<script>
import { sendWordToHTmlForm, getThemesData } from "@/server";

export default {
	name: "wordToHtml",

	data() {
		return {
			wordFile: "",
			message: "",
			errorMessage: "",
			themes: []
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
				const formData = new FormData();
				formData.append("wordFile", this.wordFile);
				formData.append("theme", event.target.theme.value);

				this.errorMessage = "";
				this.message = await sendWordToHTmlForm(formData);
			} else {
				this.errorMessage = "Please upload a file";
			}
		}
	}
};
</script>
