<template>
    <h1 class="page-title">Themes</h1>
    <ul>
        <li v-for="(theme, index) in themes" :key="index">
            <a :href="`/edit-theme/${theme.template}/${theme.slug}`">{{ theme.themeName }}</a>
        </li>
    </ul>
</template>

<script>
import { getThemesData } from "@/server";

export default {
    data() {
        return {
            themes: [],
        };
    },

    async created() {
        this.themes = await getThemesData();
    },
};
</script>
