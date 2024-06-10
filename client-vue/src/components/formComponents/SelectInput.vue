<script setup>
const props = defineProps(["options", "name", "label", "value"]);
</script>

<template>
	<div class="input">
		<label :for="name" class="label">{{ label }}</label>
		<select :name="name" class="select">
			<option v-for="option in options" :key="option.key" :value="option.value">{{ option.name }}</option>
		</select>
	</div>
</template>

<script>
export default {
	mounted() {
		const select = this.$el.querySelector("select");
		const options = select.querySelectorAll("option");
		options.forEach((option) => {
			if (option.value === this.value) {
				option.selected = true;
			}
		});
	}
};
</script>

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
