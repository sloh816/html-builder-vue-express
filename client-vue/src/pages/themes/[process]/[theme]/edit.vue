<script setup>
import StyleMapInput from "@/components/formComponents/StyleMapInput.vue";
import Button from "@/components/Button.vue";
import Accordion from "@/components/Accordion.vue";
import TextInput from "@/components/formComponents/TextInput.vue";
import SelectInput from "@/components/formComponents/SelectInput.vue";
</script>

<template>
	<h1 class="page-title">{{ data.name }}</h1>
	<form @submit.prevent="updateTheme" class="container">
		<TextInput name="themeName" label="Theme name: " :value="data.name" />
		<SelectInput name="process" label="This theme is for the process: " :value="process" :options="processOptions" />
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
		<p v-if="message" class="message message--green">{{ message }}</p>
	</form>
</template>

<script>
import { getDataById, getThemeStylesheet } from "@/server/get";
import { sendEditThemeForm } from "@/server/post";

export default {
	name: "editTheme",
	props: ["process", "theme"],

	data() {
		return {
			data: {},
			styleMap: [],
			styleInputCount: 1,
			message: "",
			showStyleMap: false,
			stylesheet: "",
			processOptions: [
				{
					key: "indesign-to-html",
					value: "InDesign to HTML",
					name: "InDesign to HTML"
				},
				{
					key: "word-to-html",
					value: "Word to HTML",
					name: "Word to HTML"
				},
				{
					key: "word-to-html-easy-read",
					value: "Word to HTML Easy Read",
					name: "Word to HTML Easy Read"
				}
			]
		};
	},

	async created() {
		this.data = await getDataById("themes", `${this.process}_${this.theme}`);
		this.styleMap = this.data.styleMap;
		this.stylesheet = await getThemeStylesheet(this.data.id);
	},

	methods: {
		addStyleInput() {
			this.styleInputCount++;
		},

		toggleStyleMap() {
			this.showStyleMap = !this.showStyleMap;
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

		async updateTheme(submitEvent) {
			const formData = new FormData();
			formData.append("themeId", `${this.process}_${this.theme}`);

			const wordStyleInputs = submitEvent.target.querySelectorAll("[name^='sm-wordstyle']");
			wordStyleInputs.forEach((input, index) => {
				if (input.value !== "") {
					const key = input.name.replace("sm-wordstyle-", "");
					const wordStyle = input.value;
					const styleType = submitEvent.target.querySelector(`[name='sm-styletype-${key}']`).value;
					const tag = submitEvent.target.querySelector(`[name='sm-tag-${key}']`).value;
					const className = submitEvent.target.querySelector(`[name='sm-class-${key}']`).value ? `.${submitEvent.target.querySelector(`[name='sm-class-${key}']`).value}` : "";
					const styleMapItem = `${styleType}[style-name='${wordStyle}'] => ${tag}${className}:fresh`;
					formData.append(`styleMapItem-${index}`, styleMapItem);
				}
			});

			const stylesheet = submitEvent.target.querySelector("textarea").value;
			formData.append("stylesheet", stylesheet);

			for (let pair of formData.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}

			this.message = await sendEditThemeForm(formData);
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
</style>
