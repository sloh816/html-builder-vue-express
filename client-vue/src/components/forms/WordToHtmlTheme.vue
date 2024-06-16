<script setup>
import TextInput from "@/components/formComponents/TextInput.vue";
import Button from "@/components/Button.vue";
import Accordion from "@/components/Accordion.vue";
import StyleMapInput from "@/components/formComponents/StyleMapInput.vue";
import DataDisplay from "@/components/DataDisplay.vue";
</script>

<template>
	<form @submit.prevent="sendThemeData">
		<DataDisplay :data="displayData" flex="flex-row" />
		<TextInput name="themeName" label="Theme name: " :value="data.name" />
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

		<Accordion summary="Stylesheet:" showButton="Show stylesheet" hideButton="Hide stylesheet">
			<textarea id="stylesheet" class="stylesheet">{{ stylesheet }}</textarea
			>.
		</Accordion>
		<Button type="submit" class="primary text-m">Update theme</Button>
	</form>
</template>

<script>
import { sendEditThemeForm } from "@/server/post";
import { getDataById, getThemeStylesheet } from "@/server/get";

export default {
	props: ["themeId"],

	data() {
		return {
			data: {},
			process: {},
			styleMap: [],
			styleInputCount: 1,
			stylesheet: "",
			displayData: {
				"Theme ID": this.themeId
			}
		};
	},

	async created() {
		this.data = await getDataById("themes", `${this.themeId}`);
		this.styleMap = this.data.styleMap;
		this.stylesheet = await getThemeStylesheet(this.data.id);
		this.process = await getDataById("processes", "word-to-html");
		this.displayData["Process"] = this.process.name;
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
		},

		async sendThemeData(submitEvent) {
			let updatedThemeData = {};

			// add themeId to updatedThemeData
			updatedThemeData.id = this.themeId;

			// add themeName to updatedThemeData
			const themeName = submitEvent.target.querySelector("[name='themeName']").value;
			updatedThemeData.name = themeName;

			// create styleMap
			let styleMap = [];
			const wordStyleInputs = submitEvent.target.querySelectorAll("[name^='sm-wordstyle']");
			wordStyleInputs.forEach((input, index) => {
				if (input.value !== "") {
					const key = input.name.replace("sm-wordstyle-", "");
					const wordStyle = input.value;
					const styleType = submitEvent.target.querySelector(`[name='sm-styletype-${key}']`).value;
					const tag = submitEvent.target.querySelector(`[name='sm-tag-${key}']`).value;
					const className = submitEvent.target.querySelector(`[name='sm-class-${key}']`).value ? `.${submitEvent.target.querySelector(`[name='sm-class-${key}']`).value}` : "";
					const styleMapItem = `${styleType}[style-name='${wordStyle}'] => ${tag}${className}:fresh`;
					styleMap.push(styleMapItem);
				}
			});

			// add styleMap to updatedThemeData
			updatedThemeData.styleMap = styleMap;

			// add stylesheet to updatedThemeData
			const stylesheet = submitEvent.target.querySelector("textarea").value;
			updatedThemeData.stylesheet = stylesheet;

			await sendEditThemeForm(updatedThemeData);

			this.message = "Updating theme...";

			setTimeout(() => {
				this.$router.push(`/themes/${this.themeId}/`);
			}, 2000);
		}
	}
};
</script>

<style scoped lang="scss">
.style-map__inputs {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.stylesheet {
	width: 100%;
	min-height: 800px;
	box-sizing: border-box;
	font-family: "Courier New", Courier, monospace;
	font-size: 0.9em;
	border: 2px solid var(--slate-800);
	border-radius: 1rem;
	padding: 1rem;
	resize: none;
}

form {
	margin-bottom: 2rem;
}
</style>
