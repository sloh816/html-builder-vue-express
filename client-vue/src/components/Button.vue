<script setup>
const props = defineProps(["href", "type", "class"]);
const classname = "button " + props.class;
</script>

<template>
	<button v-if="!href" :class="classname" :type="type"><slot /></button>
	<a v-if="href" :href="href" :class="classname"><slot /></a>
</template>

<style lang="scss">
.button {
	background: var(--orange);
	font-weight: bold;
	font-size: 1rem;
	padding: 0.5rem 1.2rem;
	border-radius: 0.6rem;
	transition: 0.3s;
	border: none;
	cursor: pointer;
	display: block;
	margin: 0 auto;
	border: 2px solid var(--orange);
	text-decoration: none;

	&.secondary {
		background: var(--slate-800);
		border: 2px solid var(--slate-800);
		color: white;

		&:visited:not(:hover) {
			color: white;
		}
	}

	&.tertiary {
		background: transparent;
		border: 2px solid var(--slate-800);
	}

	&:hover {
		background: var(--slate-200);
		border: 2px solid var(--slate-200);
		color: var(--slate-800);
	}

	&.text-m {
		font-size: 1.1rem;
	}

	&:visited {
		color: inherit;
	}
}
</style>
