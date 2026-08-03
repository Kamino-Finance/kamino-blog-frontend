import {defineBlueprint, defineDocumentFunction, defineRobotToken} from '@sanity/blueprints'

const projectId = '2kksiz70'

export default defineBlueprint({
  resources: [
    defineRobotToken({
      name: 'blog-deploy-viewer',
      label: 'Kamino blog deploy function',
      memberships: [
        {
          resourceType: 'project',
          resourceId: projectId,
          roleNames: ['viewer'],
        },
      ],
    }),
    defineDocumentFunction({
      name: 'deploy-blog',
      displayName: 'Deploy Kamino blog',
      src: 'functions/deploy-blog',
      runtime: 'nodejs24.x',
      timeout: 30,
      memory: 1,
      robotToken: '$.resources.blog-deploy-viewer.token',
      event: {
        on: ['create', 'update', 'delete'],
        filter: '_type in ["post", "author"]',
        projection: '{_id, _type}',
        includeDrafts: false,
        includeAllVersions: false,
        resource: {
          type: 'dataset',
          id: `${projectId}.production`,
        },
      },
    }),
  ],
})
