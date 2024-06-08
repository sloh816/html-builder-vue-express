<script setup>
const props = defineProps(["value"]);
</script>

<template>
	<textarea :value="value" @input="autoResize" ref="textarea" row="1" class="auto-resize-textarea"></textarea>
</template>

<script>
export default {
	methods: {
		autoResize() {
			const textareaValue = this.$refs.textarea.value;

			if (textareaValue.trim() !== "") {
				const textarea = this.$refs.textarea;
				const scrollPosition = window.scrollY;

				textarea.style.height = "auto";
				textarea.style.height = textarea.scrollHeight + "px";
				textarea.style.overflow = "hidden";

				window.scrollTo(0, scrollPosition);
			}
		}
	},

	mounted() {
		// Ensure the textarea resizes when the component is first mounted
		this.$nextTick(() => {
			this.autoResize();
		});
	}
};
</script>

<style scoped>
.auto-resize-textarea {
	width: 100%;
	min-height: 800px;
	resize: none;
	overflow: auto;
	box-sizing: border-box;
	font-family: "Courier New", Courier, monospace;
	font-size: 0.9em;
	border: 2px solid var(--slate-800);
	border-radius: 1rem;
	padding: 1rem;
}
</style>
