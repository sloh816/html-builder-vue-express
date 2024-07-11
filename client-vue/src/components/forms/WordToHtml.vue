<script setup>
import { ref } from "vue";
import FileInput from "@/components/formComponents/FileInput.vue";
import Button from "@/components/Button.vue";

const message = ref("");

// file upload code
const wordFile = ref("");
function handleFileUpload(file) {
	wordFile.value = file;
}

// form submission code
import { sendWordToHtmlForm } from "@/server/post";
const processSuccess = ref(false);
async function sendForm() {
	if (wordFile.value) {
		// this.isProcessing = true;

		const formData = new FormData();
		formData.append("wordFile", wordFile.value);

		message.value = "";
		processSuccess.value = await sendWordToHtmlForm(formData);
	} else {
		message.value = "Please upload a file.";
	}
}
</script>

<template>
	<form v-if="!isProcessing" enctype="multipart/form-data" @submit.prevent="sendForm" class="container">
		<p v-if="message" class="message">{{ message }}</p>
		<FileInput label="Upload a Word Document:" name="wordFile" @onFileUpload="handleFileUpload" />
		<Button class="primary text-m" type="submit">Submit</Button>
	</form>
</template>
