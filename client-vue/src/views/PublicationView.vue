<template>
	<iframe :src="indexFile" width="100%" height="100%" frameborder="0"></iframe>
</template>

<script>
import { getPublicationData, server_url } from "@/server.js";
export default {
	name: "PublicationView",
	props: ["publicationFolder"],

	data() {
		return {
			publication: {},
			indexFile: server_url + "/" + this.publicationFolder + "/output/index.html"
		};
	},

	async created() {
		this.publication = await getPublicationData(this.publicationFolder);
	}
};
</script>

<style scoped lang="scss">
iframe {
	background: white;
	width: 100vw;
	height: 100vh;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
</style>
