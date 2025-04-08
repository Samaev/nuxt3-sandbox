// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['usebootstrap', '@nuxtjs/storybook'],
  ssr: true,
  runtimeConfig: {
    public: {
      mapBoxToken: process.env.MAP_BOX_TOKEN,
    }
  }
})