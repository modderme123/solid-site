import './assets/main.css';
import { App } from './App';
import { MetaProvider } from 'solid-meta';
import { createApp } from 'solid-utils';
// import { registerSW } from 'virtual:pwa-register';

createApp(App).use(MetaProvider).mount('#app');

// Register service worker
// registerSW({ onOfflineReady() {} });
