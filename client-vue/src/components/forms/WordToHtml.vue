<template>
	<form enctype="multipart/form-data" @submit.prevent="sendForm">
		<label for="wordFile" class="label">Upload a Word document:</label>
		<input type="file" ref="wordFile" @change="handleFile" />
		<button>Submit</button>
	</form>
	<p>{{ message }}</p>
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
		handleFile() {
			// store the upload word file to the wordFile variable.
			this.wordFile = this.$refs.wordFile.files[0];
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
