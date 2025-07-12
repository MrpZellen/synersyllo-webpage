// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
import google from 'googleapis';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  modules: [
    'nuxt-mongoose'
  ],
  runtimeConfig: {
    OAUTHID: process.env.NUXT_OAUTHID,
    OAUTHSECRET: process.env.NUXT_OAUTHSECRET,
    REDIRECT: process.env.NUXT_REDIRECT
  }
})
