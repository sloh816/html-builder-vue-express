<template>
    <h1 class="page-title">Themes</h1>
    <ul>
        <li v-for="(theme, index) in themes" :key="index">
            <a :href="`/themes/${theme.template}/${theme.slug}/edit`">{{ theme.themeName }}</a>
        </li>
    </ul>
</template>

<script>
import { getThemesData } from "@/server/get";

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
