import Main from '../routes/main/Main.vue';
import Dashboard from '../routes/dashboard/Dashboard.vue';
import {createRouter,createWebHashHistory} from 'vue-router'
let routes: ({ path: string; component: any })[];


routes = [
    {path: '/', component: Main ,name:"designer"},
    {path: '/dashboard', component: Dashboard, name: "dashboard"},
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
});
