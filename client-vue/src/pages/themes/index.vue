<template>
    <h1 class="page-title">Themes</h1>
    <ul>
        <li v-for="(theme, index) in themes" :key="index">
            <a :href="`/themes/${theme.processSlug}/${theme.slug}/edit`">{{ theme.name }}</a>
        </li>
    </ul>
</template>

<script>
import { getThemes } from "@/server/get";

export default {
    data() {
        return {
            themes: [],
        };
    },

    async created() {
        this.themes = await getThemes();
    },
};
</script>
