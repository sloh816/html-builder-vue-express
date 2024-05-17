<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
	<header>
		<div class="title">
			<img alt="IAG icon" src="@/assets/iag-icon.png" width="40" height="40" />
			<p>HTML Builder</p>
		</div>
		<nav>
			<RouterLink to="/">Processes</RouterLink>
			<RouterLink to="/publications">Publications</RouterLink>
			<RouterLink to="/themes">Themes</RouterLink>
		</nav>
	</header>
</template>

<style lang="scss" scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	background-color: white;
	box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.1);
	position: fixed;
	width: 100%;

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;

		p {
			font-weight: bold;
			font-size: 1.7rem;
		}
	}

	nav {
		display: flex;
		gap: 2rem;

		a {
			text-decoration: none;
			font-weight: bold;
			font-size: 1rem;
			padding: 0.6rem 1.2rem;
			border-radius: 0.6rem;
			transition: 0.3s;

			&[aria-current="page"] {
				background: var(--light-orange);
			}

			&:hover {
				background: var(--slate-200);
			}

			&:visited {
				color: inherit;
			}
		}
	}
}
</style>
