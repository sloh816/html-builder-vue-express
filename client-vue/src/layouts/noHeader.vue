<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
</script>

<template>
	<main><RouterView /></main>
</template>

<style scoped>
main {
	max-width: 1200px;
	margin: 0 auto;
	padding-bottom: 4rem;
	padding-top: 9rem;

	@media screen and (max-width: 1200px) {
		margin: 0 20px;
	}
}
</style>
