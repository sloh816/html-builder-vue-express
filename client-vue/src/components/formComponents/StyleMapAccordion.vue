<script setup>
import Accordion from "@/components/Accordion.vue";
import StyleMapInput from "@/components/formComponents/StyleMapInput.vue";

const props = defineProps(["styleMap"]);
</script>

<template>
	<Accordion summary="Map Word styles to class names:" showButton="Show Style Map" hideButton="Hide Style Map">
		<div class="style-map__inputs">
			<StyleMapInput v-if="styleMap.length === 0" showLabels="true" @addButton="addStyleInput" index="0" />
			<StyleMapInput v-else showLabels="true" @addButton="addStyleInput" index="0" :styletype="getStyleType(styleMap[0])" :wordstyle="getWordStyle(styleMap[0])" :tag="getTag(styleMap[0])" :class="getClass(styleMap[0])" />

			<div v-if="styleMap.length > 1" v-for="n in styleMap.length - 1" :key="n">
				<StyleMapInput @addButton="addStyleInput" :index="n" :styletype="getStyleType(styleMap[n])" :wordstyle="getWordStyle(styleMap[n])" :tag="getTag(styleMap[n])" :class="getClass(styleMap[n])" />
			</div>

			<div v-for="n in styleInputCount">
				<StyleMapInput @addButton="addStyleInput" :index="n + styleMap.length - 1" />
			</div>
		</div>
	</Accordion>
</template>

<script>
export default {
	data() {
		return {
			styleInputCount: 1
		};
	},

	methods: {
		addStyleInput() {
			this.styleInputCount++;
		},

		getStyleType(styleMapItem) {
			const firstSquareBracket = styleMapItem.indexOf("[");
			const styleType = styleMapItem.slice(0, firstSquareBracket);
			return styleType;
		},

		getWordStyle(styleMapItem) {
			const regex = /'([^']+)'/;
			const match = styleMapItem.match(regex);
			return match ? match[1] : null;
		},

		getTag(styleMapItem) {
			const tag = styleMapItem.split(" => ")[1].split(".")[0];
			return tag;
		},

		getClass(styleMapItem) {
			const regex = /\.([a-z0-9-]+)/i;
			const match = styleMapItem.match(regex);
			return match ? match[1] : null;
		}
	}
};
</script>

<style lang="scss" scoped>
.style-map__inputs {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
</style>
