import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/views/auth.vue'; 
import Chat from '@/views/chat.vue';

const routes = [
    {
        path: '/',
        name: 'auth',
        component: Auth
    },
    {
        path: '/chat',
        name: 'chat',
        component: Chat
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
