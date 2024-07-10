<script setup>
import DataDisplay from "../DataDisplay.vue";
import TextInput from "../formComponents/TextInput.vue";
import StyleMapAccordion from "../formComponents/StyleMapAccordion.vue";
import Button from "../Button.vue";
</script>

<template>
	<form @submit.prevent="sendThemeData">
		<DataDisplay :data="displayData" flex="flex-row" />
		<TextInput name="themeName" label="Theme name: " :value="data.name" />
		<StyleMapAccordion :styleMap="styleMap" />
		<Button v-if="action === 'edit'" type="submit" class="primary text-m">Update theme</Button>
		<Button v-else type="submit" class="primary text-m">Create new theme</Button>
	</form>
</template>

<script>
import { getDataById } from "@/server/get";
import { sendThemeForm } from "@/server/post";

export default {
	props: ["themeId", "action"],

	data() {
		return {
			process: {},
			data: {},
			styleMap: [],
			styleInputCount: 1,
			displayData: {
				"Theme ID": this.themeId
			}
		};
	},

	async created() {
		this.process = await getDataById("processes", "easy-read-word-to-html");
		this.displayData["Process"] = this.process.name;
		this.data = await getDataById("themes", this.themeId);
		this.styleMap = this.data.styleMap;
	},

	methods: {
		async sendThemeData(submitEvent) {
			let newThemeData = {};

			// add themeId to newThemeData
			newThemeData.id = this.themeId;

			// add themeName to newThemeData
			const themeName = submitEvent.target.querySelector("[name='themeName']").value;
			newThemeData.name = themeName;

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

			// add styleMap to newThemeData
			newThemeData.styleMap = styleMap;

			// add action
			newThemeData.action = this.action;
			console.log(newThemeData);

			await sendThemeForm(newThemeData);

			this.message = "Updating theme...";

			setTimeout(() => {
				this.$router.push(`/themes/`);
			}, 2000);
		}
	}
};
</script>
