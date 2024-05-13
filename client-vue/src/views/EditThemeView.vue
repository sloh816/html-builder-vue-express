<script setup>
import StyleMapInput from "@/components/formComponents/StyleMapInput.vue";
import Button from "@/components/Button.vue";
</script>

<template>
    <h1 class="page-title">{{ themeData.themeName }}</h1>
    <form @submit.prevent="updateTheme">
        <div class="style-map">
            <h2>Map Word styles to class names:</h2>
            <StyleMapInput v-if="styleMap.length === 0" showLabels="true" @addButton="addStyleInput" index="0" />
            <StyleMapInput v-else showLabels="true" @addButton="addStyleInput" index="0" :styletype="getStyleType(styleMap[0])" :wordstyle="getWordStyle(styleMap[0])" :tag="getTag(styleMap[0])" :class="getClass(styleMap[0])" />

            <div v-if="styleMap.length > 1" v-for="n in styleMap.length - 1" :key="n">
                <StyleMapInput @addButton="addStyleInput" :index="n" :styletype="getStyleType(styleMap[n])" :wordstyle="getWordStyle(styleMap[n])" :tag="getTag(styleMap[n])" :class="getClass(styleMap[n])" />
            </div>

            <div v-for="n in styleInputCount">
                <StyleMapInput @addButton="addStyleInput" :index="n + styleMap.length - 1" />
            </div>
        </div>
        <Button type="submit">Update theme</Button>
    </form>
</template>

<script>
import { getThemeData, sendEditThemeForm } from "@/server";

export default {
    name: "editTheme",
    props: ["template", "themeSlug"],

    data() {
        return {
            themeData: {},
            styleMap: [],
            styleInputCount: 1,
        };
    },

    async created() {
        this.themeData = await getThemeData(this.themeSlug);
        this.styleMap = this.themeData.styleMap;
    },

    methods: {
        addStyleInput() {
            this.styleInputCount++;
        },

        getStyleType(styleMapItem) {
            const regex = /^([a-z0-9]+)\[/i;
            const match = styleMapItem.match(regex);
            return match ? match[1] : null;
        },

        getWordStyle(styleMapItem) {
            const regex = /'([^']+)'/;
            const match = styleMapItem.match(regex);
            return match ? match[1] : null;
        },

        getTag(styleMapItem) {
            const regex = /=>\s*([a-z0-9]+)/i;
            const match = styleMapItem.match(regex);
            return match ? match[1] : null;
        },

        getClass(styleMapItem) {
            const regex = /\.([a-z0-9-]+)/i;
            const match = styleMapItem.match(regex);
            return match ? match[1] : null;
        },

        async updateTheme(submitEvent) {
            const formData = new FormData();
            formData.append("themeSlug", this.themeSlug);

            // const wordStyleInputs = submitEvent.target.querySelectorAll("[name^='sm-wordstyle']");
            // wordStyleInputs.forEach((input, index) => {
            //     if (input.value !== "") {
            //         const key = input.name.replace("sm-wordstyle-", "");
            //         const wordStyle = input.value;
            //         const styleType = submitEvent.target.querySelector(`[name='sm-styletype-${key}']`).value;
            //         const tag = submitEvent.target.querySelector(`[name='sm-tag-${key}']`).value;
            //         const className = submitEvent.target.querySelector(`[name='sm-class-${key}']`).value;
            //         const styleMapItem = `${styleType}[style-name='${wordStyle}'] => ${tag}.${className}:fresh`;
            //         formData.append(`styleMapItem-${index}`, styleMapItem);
            //     }
            // });

            await sendEditThemeForm(formData);
        },
    },
};
</script>

<style scoped lang="scss">
.style-map {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
