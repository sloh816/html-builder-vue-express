<script setup>
const props = defineProps(["name", "label", "value"]);
</script>

<template>
	<div class="input">
		<label :for="name" class="label">{{ label }}</label>
		<input :name="name" type="text" :value="value" />
	</div>
</template>

<style scoped lang="scss">
input {
	padding: 0.6rem;
	border: 2px solid var(--slate-800);
	border-radius: 0.6rem;
	font-size: 1.05rem;
	width: 100%;
}
</style>
