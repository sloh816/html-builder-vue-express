<template>
	<p>Processing...{{ processSlug }}</p>
</template>

<script>
export default {
	name: "ProcessingView",
	props: ["processSlug"]
};
</script>
