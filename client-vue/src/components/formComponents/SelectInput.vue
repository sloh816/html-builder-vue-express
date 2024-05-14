<script setup>
const props = defineProps(["options", "name"]);
</script>

<template>
	<div class="input">
		<label :for="name" class="label">Select a theme:</label>
		<select :name="name">
			<option v-for="option in options" :key="option.key" :value="option.value">{{ option.name }}</option>
		</select>
	</div>
</template>

<style scoped lang="scss">
select {
	padding: 0.6rem;
	border: 2px solid var(--slate-800);
	border-radius: 0.6rem;
	font-size: 1.05rem;
	width: 100%;
	cursor: pointer;
}
</style>
