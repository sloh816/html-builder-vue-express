<script setup>
import Button from "@/components/Button.vue";
</script>

<template>
	<h1 class="page-title">Themes</h1>
	<div v-for="process in processes" :key="process.id" :id="process.id">
		<h2>{{ process.name }}</h2>
		<ul>
			<li v-for="(theme, index) in themes[process.id]">
				<span class="name">{{ theme.name }}</span>
				<span class="id">ID: {{ theme.id }}</span>
				<div class="buttons">
					<Button :href="`/themes/${theme.id}/edit`" class="secondary text-sm">Edit theme</Button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { getData } from "@/server/get";

export default {
	data() {
		return {
			themes: {},
			processes: []
		};
	},

	async created() {
		const allThemes = await getData("themes");
		this.processes = await getData("processes");
		for (let i = 0; i < this.processes.length; i++) {
			const process = this.processes[i];
			this.themes[process.id] = allThemes.filter((theme) => theme.processId === process.id);
		}
	}
};
</script>

<style lang="scss" scoped>
ul {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 0;
	padding: 0;

	li {
		display: flex;
		gap: 1rem;
		background: white;
		padding: 10px 10px 10px 24px;
		border-radius: 1rem;
		align-items: center;
	}

	.name,
	.id {
		flex-basis: 200px;
	}

	.name {
		font-weight: bold;
	}

	.id {
		flex-grow: 1;
	}
}
</style>
