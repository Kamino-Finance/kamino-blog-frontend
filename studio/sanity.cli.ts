import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2kksiz70',
    dataset: 'production',
  },
  studioHost: 'kamino-blog',
  autoUpdates: true,
  deployment: {
    appId: 'wjfsewr1b6ywb847g3aey7pt',
  },
})
