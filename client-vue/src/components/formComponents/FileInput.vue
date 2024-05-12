<script setup>
const props = defineProps(["label", "name"]);
</script>

<template>
	<div class="input">
		<label :for="`${name}`" class="label">{{ label }}</label>
		<input type="file" :ref="`${name}`" @change="emitFile" />
	</div>
</template>

<script>
export default {
	methods: {
		emitFile(event) {
			this.$emit("onFileUpload", event.target.files[0]);
		}
	}
};
</script>

<style scoped lang="scss">
input[type="file"] {
	cursor: pointer;
	width: 100%;
	background: var(--slate-200);
	padding: 3rem 4rem;
	border-radius: 1rem;
	border: 2px dashed var(--slate-400);
	color: var(--slate-600);
	font-weight: bold;
	transition: 0.3s;

	&:hover {
		background: #f1f5f9;
	}
}
</style>
