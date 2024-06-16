<script setup>
const props = defineProps(["name", "label", "value"]);
</script>

<template>
	<div class="input">
		<label :for="name" class="label">{{ label }}</label>
		<input :name="name" type="text" :value="value" />
	</div>
</template>
