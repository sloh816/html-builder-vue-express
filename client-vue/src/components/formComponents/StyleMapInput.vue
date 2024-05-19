<script setup>
import Button from "@/components/Button.vue";
const props = defineProps(["showLabels", "index", "styletype", "wordstyle", "tag", "class"]);
</script>

<template>
	<div class="style-map-input">
		<div class="style-map-input__inputs">
			<div class="input">
				<label :for="`sm-styletype-${index}`" class="label" v-if="showLabels"
					>Style type:</label
				>
				<select :name="`sm-styletype-${index}`">
					<option value="p" :selected="styletype === 'p'">Paragraph</option>
					<option value="r" :selected="styletype === 'r'">Character</option>
					<option value="table" :selected="styletype === 'table'">Table</option>
				</select>
			</div>
			<div class="input">
				<label :for="`sm-wordstyle-${index}`" class="label" v-if="showLabels"
					>Word style name:</label
				>
				<input type="text" :name="`sm-wordstyle-${index}`" :value="wordstyle" />
			</div>
			<div class="input">
				<label :for="`sm-tag-${index}`" class="label" v-if="showLabels">Tag name:</label>
				<input type="text" :name="`sm-tag-${index}`" :value="tag" />
			</div>
			<div class="input">
				<label :for="`sm-class-${index}`" class="label" v-if="showLabels"
					>Class name:</label
				>
				<input type="text" :name="`sm-class-${index}`" :value="class" />
			</div>
		</div>
		<button type="button" class="button secondary style-map-input__add" @click="emitAdd">
			Add
		</button>
	</div>
</template>

<script>
export default {
	methods: {
		emitAdd() {
			this.$emit("addButton");
		}
	}
};
</script>

<style scoped lang="scss">
.style-map-input {
	display: flex;
	gap: 1rem;
	align-items: flex-end;

	&__inputs {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(4, 1fr);
		flex-grow: 1;
	}

	&__add {
		margin: 0;
	}

	select {
		width: 100%;
	}

	input {
		width: 100%;
	}

	input,
	select {
		padding: 0.5rem;
		border: 2px solid var(--slate-800);
		border-radius: 0.6rem;
		font-size: 1rem;
	}

	.label {
		color: var(--slate-600);
	}
}
</style>
