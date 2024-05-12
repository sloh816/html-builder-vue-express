<script setup>
import FileInput from "@/components/formComponents/FileInput.vue";
import Button from "@/components/Button.vue";
</script>

<template>
	<form enctype="multipart/form-data" @submit.prevent="sendForm">
		<p v-if="message" class="error-message">{{ message }}</p>
		<FileInput label="Upload a Word Document:" name="wordFile" @onFileUpload="handleFileUpload" />
		<Button class="primary" type="submit">Submit</Button>
	</form>
</template>

<script>
import { sendWordToHTmlForm } from "@/server";

export default {
	name: "wordToHtml",

	data() {
		return {
			wordFile: "",
			message: ""
		};
	},

	methods: {
		handleFileUpload(file) {
			// store the upload word file to the wordFile variable.
			this.wordFile = file;
		},

		async sendForm() {
			if (this.wordFile) {
				const formData = new FormData();
				formData.append("wordFile", this.wordFile);
				this.message = await sendWordToHTmlForm(formData);
			} else {
				this.message = "Please upload a file";
			}
		}
	}
};
</script>
