import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { 
        path: '/',
        name: 'Home',
        component: () => import('../components/Home.vue')
    },
    { 
        path: '/details/:name',
        name: 'PokemonDetails',
        component: () => import('../pages/PokemonDetails.vue'),
        props: true,
    },
    {
        path: '/:catch(.*)',
        component: () => import('../components/NotFound.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes

});

export default router;