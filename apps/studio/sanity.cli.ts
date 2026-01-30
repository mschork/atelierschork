import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  studioHost: 'atelierschork',
  deployment: {
    appId: 'yzxbkxz7w1hhvsngvy4s1gsz',
    autoUpdates: true,
  },
  reactStrictMode: true,
})
