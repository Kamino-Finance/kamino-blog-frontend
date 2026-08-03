import assert from 'node:assert/strict'
import test from 'node:test'
import {decodePrivateKey, dispatchWorkflow, type HttpRequest} from './index.ts'

const privateKey = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'test-key-material',
  '-----END RSA PRIVATE KEY-----',
].join('\n')

test('decodePrivateKey decodes a base64 PEM key', () => {
  const encodedPrivateKey = Buffer.from(privateKey).toString('base64')

  assert.equal(decodePrivateKey(encodedPrivateKey), privateKey)
})

test('decodePrivateKey rejects missing and malformed values', () => {
  assert.throws(() => decodePrivateKey(undefined), /missing or is not valid base64/)
  assert.throws(
    () => decodePrivateKey(Buffer.from('not a PEM key').toString('base64')),
    /does not contain a supported PEM private key/,
  )
})

test('dispatchWorkflow calls the fixed production workflow', async () => {
  let requestUrl: string | URL | Request | undefined
  let requestInit: RequestInit | undefined
  const request: HttpRequest = async (input, init) => {
    requestUrl = input
    requestInit = init
    return new Response(null, {status: 200})
  }

  await dispatchWorkflow('installation-token', {request})

  assert.equal(
    String(requestUrl),
    'https://api.github.com/repos/Kamino-Finance/kamino-blog-frontend/actions/workflows/deploy.yml/dispatches',
  )
  assert.equal(requestInit?.method, 'POST')
  assert.equal(requestInit?.body, '{"ref":"master"}')

  const headers = new Headers(requestInit?.headers)
  assert.equal(headers.get('authorization'), 'Bearer installation-token')
  assert.equal(headers.get('x-github-api-version'), '2026-03-10')
})

test('dispatchWorkflow retries temporary GitHub failures', async () => {
  let requestCount = 0
  const delays: number[] = []
  const request: HttpRequest = async () => {
    requestCount += 1
    return new Response(null, {status: requestCount === 1 ? 503 : 200})
  }

  await dispatchWorkflow('installation-token', {
    request,
    sleep: async (milliseconds) => {
      delays.push(milliseconds)
    },
  })

  assert.equal(requestCount, 2)
  assert.deepEqual(delays, [500])
})

test('dispatchWorkflow does not retry authorization failures', async () => {
  let requestCount = 0
  const request: HttpRequest = async () => {
    requestCount += 1
    return new Response(null, {status: 401})
  }

  await assert.rejects(
    dispatchWorkflow('installation-token', {request}),
    /failed with status 401/,
  )
  assert.equal(requestCount, 1)
})
