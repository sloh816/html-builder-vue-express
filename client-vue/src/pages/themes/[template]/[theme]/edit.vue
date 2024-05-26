<script setup>
import StyleMapInput from "@/components/formComponents/StyleMapInput.vue";
import Button from "@/components/Button.vue";
import SandpackEditor from "@/components/SandpackEditor.vue";
</script>

<template>
	<h1 class="page-title">
		{{ themeData.themeName }}
	</h1>
	<form @submit.prevent="updateTheme" class="container">
		<div class="style-map">
			<div class="style-map__heading">
				<h2>Map Word styles to class names:</h2>
				<button class="button secondary" id="toggle-style-map" type="button" @click="toggleStyleMap">
					<span v-if="showStyleMap">Hide Style Map</span>
					<span v-if="!showStyleMap">Show Style Map</span>
				</button>
			</div>
			<div v-if="showStyleMap" class="style-map__inputs">
				<StyleMapInput v-if="styleMap.length === 0" showLabels="true" @addButton="addStyleInput" index="0" />
				<StyleMapInput v-else showLabels="true" @addButton="addStyleInput" index="0" :styletype="getStyleType(styleMap[0])" :wordstyle="getWordStyle(styleMap[0])" :tag="getTag(styleMap[0])" :class="getClass(styleMap[0])" />

				<div v-if="styleMap.length > 1" v-for="n in styleMap.length - 1" :key="n">
					<StyleMapInput @addButton="addStyleInput" :index="n" :styletype="getStyleType(styleMap[n])" :wordstyle="getWordStyle(styleMap[n])" :tag="getTag(styleMap[n])" :class="getClass(styleMap[n])" />
				</div>

				<div v-for="n in styleInputCount">
					<StyleMapInput @addButton="addStyleInput" :index="n + styleMap.length - 1" />
				</div>
			</div>
		</div>

		<div>
			<h2>Stylesheet:</h2>
			<button @click="generateIndexHtml" class="button secondary left" type="button">Generate HTML</button>
			<SandpackEditor :indexHtmlCode="indexHtml" :key="sandpackKey" />
		</div>
		<Button type="submit" class="primary text-m">Update theme</Button>
		<p v-if="message" class="message message--green">
			{{ message }}
		</p>
	</form>
</template>

<script>
import { getThemeData, sendEditThemeForm } from "@/server";

export default {
	name: "editTheme",
	props: ["template", "theme"],

	data() {
		return {
			themeData: {},
			styleMap: [],
			styleInputCount: 1,
			message: "",
			showStyleMap: false,
			indexHtml: "",
			sandpackKey: 0
		};
	},

	async created() {
		this.themeData = await getThemeData(this.theme);
		this.styleMap = this.themeData.styleMap;
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

		generateIndexHtml() {
			const styleMap = this.styleMap.map((styleMapItem) => {
				const styleType = this.getStyleType(styleMapItem);
				const wordStyle = this.getWordStyle(styleMapItem);
				const tag = this.getTag(styleMapItem);
				const className = this.getClass(styleMapItem);

				if (styleType !== "table") {
					let openTags = tag.split(" > ");
					openTags[openTags.length - 1] = `${openTags[openTags.length - 1]} class="${className}"`;
					openTags = openTags
						.map((t) => {
							return `<${t}>`;
						})
						.join("");

					const closingTags = tag
						.split(" > ")
						.map((t) => {
							return `</${t}>`;
						})
						.join("");
					return `${openTags}${wordStyle}${closingTags}`;
				}
			});

			const indexHtml = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="style.css" />
        <title>Document</title>
    </head>
    <body>
        <div class="html-content">${styleMap.join("\n\t\t")}</div>
    </body>
</html>
            `;
			this.indexHtml = indexHtml;
			this.sandpackKey++;
		},

		async updateTheme(submitEvent) {
			const formData = new FormData();
			formData.append("themeFolder", `${this.template}_${this.themeSlug}`);

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

			this.message = await sendEditThemeForm(formData);
		}
	}
};
</script>

<style scoped lang="scss">
.style-map {
	display: flex;
	flex-direction: column;
	gap: 2rem;

	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;

		h2 {
			margin: 0;
		}
	}

	&__inputs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	#toggle-style-map {
		margin: 0;
	}
}
</style>
