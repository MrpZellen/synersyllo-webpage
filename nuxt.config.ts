// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
import google from 'googleapis';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/Logo.ico' }]
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  runtimeConfig: {
    OAUTHID: process.env.NUXT_OAUTHID,
    OAUTHSECRET: process.env.NUXT_OAUTHSECRET,
    REDIRECT: process.env.NUXT_REDIRECT
  }, //unstorage definitions
  modules: [
    'nuxt-mongoose'
  ],
  plugins: [
    'vue-select'
  ],
  nitro: {
    storage: {
      production: {
        driver: 'memory'
      }
    },
    devStorage: {
      production: {
        driver: 'memory'
      }
    }
  }
})