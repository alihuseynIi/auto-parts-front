// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';
import i18n from './i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas, far);

i18n.global.locale.value = localStorage.getItem('userLocale') || 'AZ';

window.onLoadRecaptcha = () => {
    window.dispatchEvent(new Event('recaptchaLoaded'));
};

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router)
    .use(store)
    .use(vuetify)
    .use(i18n)
    .mount('#app');
