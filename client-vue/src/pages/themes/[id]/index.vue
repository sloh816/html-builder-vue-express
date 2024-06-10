<template>
	<p>Redirecting...</p>
</template>

<script>
export default {
	name: "editTheme",
	props: ["id"],

	async created() {
		this.$router.push(`/themes/${this.id}/edit`);
	}
};
</script>
