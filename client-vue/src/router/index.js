import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView
		},
		{
			path: "/publications",
			name: "publications",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/PublicationsView.vue")
		},
		{
			path: "/themes",
			name: "themes",
			component: () => import("../views/ThemesView.vue")
		},
		{
			path: "/edit-theme/:template/:themeSlug",
			name: "editTheme",
			component: () => import("../views/EditThemeView.vue"),
			props: true
		},
		{
			path: "/process/:processSlug",
			name: "process",
			component: () => import("../views/ProcessView.vue"),
			props: true
		}
	]
});

export default router;
