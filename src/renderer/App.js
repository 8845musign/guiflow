import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Test from './Test.vue';

const app = createApp(Test)

app.use(createPinia())

app.mount('#app')