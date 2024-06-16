<template>
	<iframe :src="indexFile" width="100%" height="100%" frameborder="0"></iframe>
</template>

<route lang="yaml">
meta:
    layout: "blank"
</route>

<script>
import { getPublicationPreview } from "@/server/get";

export default {
	name: "PublicationView",
	props: ["id"],

	data() {
		return {
			indexFile: ""
		};
	},

	async created() {
		this.indexFile = await getPublicationPreview(this.id);
	}
};
</script>

<style scoped lang="scss">
iframe {
	background: white;
	width: 100%;
	height: 100vh;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
</style>
