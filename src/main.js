/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'

import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import i18n from './i18n'

const app = createApp(App).use(i18n).use(i18n)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)

app.mount('#app')
