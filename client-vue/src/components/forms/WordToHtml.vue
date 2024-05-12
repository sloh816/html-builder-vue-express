<template>
	<form @submit.prevent="submitForm" enctype="multipart/form-data">
		<label>Upload a Word document: <input type="file" @change="handleFileChange" ref="wordFile" /></label>
		<button>Submit</button>
	</form>
</template>

<script>
import axios from "axios";

export default {
	data() {
		return {
			formData: {
				wordFile: null,
				template: "word-to-html"
			}
		};
	},

	methods: {
		async submitForm() {
			const formData = new FormData();
			formData.append("wordFile", this.formData.wordFile);
			formData.append("template", this.formData.template);

			const response = await axios.post("http://localhost:3000/api/word-to-html", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			console.log(response.data);
		},

		handleFileChange(event) {
			this.formData.wordFile = event.target.files[0];
		}
	}
};
</script>
