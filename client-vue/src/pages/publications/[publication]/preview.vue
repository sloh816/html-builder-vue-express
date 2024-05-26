<template>
	<iframe :src="indexFile" width="100%" height="100%" frameborder="0"></iframe>
</template>

<route lang="yaml">
meta:
    layout: "noHeader"
</route>

<script>
import { getPublicationData, server_url } from "@/server.js";
export default {
	name: "PublicationView",
	props: ["publication"],

	data() {
		return {
			publicationObject: {},
			indexFile: server_url + "/" + this.publication + "/output/index.html"
		};
	},

	async created() {
		this.publicationObject = await getPublicationData(this.publication);
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
