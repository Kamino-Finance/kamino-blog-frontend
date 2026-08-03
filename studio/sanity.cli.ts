import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2kksiz70',
    dataset: 'production',
  },
  studioHost: 'kamino-blog',
  deployment: {
    appId: 'wjfsewr1b6ywb847g3aey7pt',
    autoUpdates: true,
  },
})
