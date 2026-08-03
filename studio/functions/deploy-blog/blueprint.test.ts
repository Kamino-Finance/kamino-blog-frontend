import assert from 'node:assert/strict'
import test from 'node:test'
import type {BlueprintDocumentFunctionResource} from '@sanity/blueprints'
import blueprint from '../../sanity.blueprint.ts'

test('Blueprint scopes deploy-blog to published production content', () => {
  const manifest = blueprint()
  const deploymentFunction = manifest.resources?.find(
    (resource): resource is BlueprintDocumentFunctionResource =>
      resource.name === 'deploy-blog' && resource.type === 'sanity.function.document',
  )

  assert.ok(deploymentFunction, 'deploy-blog document function is missing')

  assert.deepEqual(deploymentFunction.event.on, ['create', 'update', 'delete'])
  assert.equal(deploymentFunction.event.filter, '_type in ["post", "author"]')
  assert.equal(deploymentFunction.event.includeDrafts, false)
  assert.equal(deploymentFunction.event.includeAllVersions, false)
  assert.equal(deploymentFunction.event.resource?.id, '2kksiz70.production')
  assert.equal(deploymentFunction.robotToken, '$.resources.blog-deploy-viewer.token')
})
