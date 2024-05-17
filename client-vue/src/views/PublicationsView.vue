<script setup>
import Button from "@/components/Button.vue";
</script>

<template>
	<h1 class="page-title">Publications</h1>
	<ul>
		<li v-for="(publication, index) in publications" :key="index">
			<span class="date">{{ publication.date }}</span>
			<span class="time">{{ publication.time }}</span>
			<span class="name">{{ publication.name }}</span>
			<div class="buttons">
				<Button class="secondary text-small" :href="`/publication/${publication.folder}`">Preview</Button>
			</div>
		</li>
	</ul>
</template>

<script>
import { getPublications } from "@/server.js";

export default {
	name: "PublicationsView",

	data() {
		return {
			publications: []
		};
	},

	async created() {
		this.publications = await getPublications();
		this.publications = this.publications.reverse();
	}
};
</script>

<style lang="scss">
ul {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	li {
		display: flex;
		gap: 1rem;
		background: white;
		padding: 0.6rem 1.2rem;
		border-radius: 1rem;
		align-items: center;

		.date,
		.time {
			flex-basis: 120px;
		}

		.name {
			flex-grow: 1;
		}
	}
}
</style>
