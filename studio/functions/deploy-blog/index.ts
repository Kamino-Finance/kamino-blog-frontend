import {createAppAuth} from '@octokit/auth-app'
import {documentEventHandler} from '@sanity/functions'

const githubAppId = 4474304
const githubInstallationId = 150961368
const githubOwner = 'Kamino-Finance'
const githubRepository = 'kamino-blog-frontend'
const githubWorkflow = 'deploy.yml'
const githubRef = 'master'
const githubApiVersion = '2026-03-10'
const privateKeyEnvironmentVariable = 'GITHUB_APP_PRIVATE_KEY_BASE64'
const retryDelaysMs = [500, 1_000] as const

const workflowDispatchUrl =
  `https://api.github.com/repos/${githubOwner}/${githubRepository}` +
  `/actions/workflows/${githubWorkflow}/dispatches`

type BlogDocumentEvent = {
  _id: string
  _type: 'author' | 'post'
}

export type HttpRequest = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>

type Sleep = (milliseconds: number) => Promise<void>

type DispatchOptions = {
  request?: HttpRequest
  sleep?: Sleep
}

const defaultSleep: Sleep = async (milliseconds) => {
  await new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
}

const isRetryableStatus = (status: number) => status === 429 || status >= 500

export function decodePrivateKey(encodedPrivateKey: string | undefined): string {
  const normalized = encodedPrivateKey?.replace(/\s/g, '')

  if (!normalized || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
    throw new Error(`${privateKeyEnvironmentVariable} is missing or is not valid base64`)
  }

  const privateKey = Buffer.from(normalized, 'base64').toString('utf8').trim()
  const isPkcs1 =
    privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----') &&
    privateKey.endsWith('-----END RSA PRIVATE KEY-----')
  const isPkcs8 =
    privateKey.startsWith('-----BEGIN PRIVATE KEY-----') &&
    privateKey.endsWith('-----END PRIVATE KEY-----')

  if (!isPkcs1 && !isPkcs8) {
    throw new Error(`${privateKeyEnvironmentVariable} does not contain a supported PEM private key`)
  }

  return privateKey
}

async function createInstallationToken(privateKey: string): Promise<string> {
  const authenticate = createAppAuth({
    appId: githubAppId,
    installationId: githubInstallationId,
    privateKey,
  })
  const authentication = await authenticate({
    type: 'installation',
    repositoryNames: [githubRepository],
    permissions: {actions: 'write'},
  })

  return authentication.token
}

export async function dispatchWorkflow(
  installationToken: string,
  options: DispatchOptions = {},
): Promise<void> {
  const request = options.request ?? fetch
  const sleep = options.sleep ?? defaultSleep

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    let response: Response

    try {
      response = await request(workflowDispatchUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${installationToken}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': githubApiVersion,
        },
        body: JSON.stringify({ref: githubRef}),
      })
    } catch (error) {
      if (attempt === retryDelaysMs.length) {
        throw new Error('GitHub workflow dispatch request failed', {cause: error})
      }

      await sleep(retryDelaysMs[attempt])
      continue
    }

    if (response.ok) {
      return
    }

    if (!isRetryableStatus(response.status) || attempt === retryDelaysMs.length) {
      throw new Error(`GitHub workflow dispatch failed with status ${response.status}`)
    }

    await sleep(retryDelaysMs[attempt])
  }
}

export const handler = documentEventHandler<BlogDocumentEvent>(async ({event}) => {
  console.info(`Requesting blog deployment for ${event.data._type} ${event.data._id}`)

  const privateKey = decodePrivateKey(process.env[privateKeyEnvironmentVariable])
  const installationToken = await createInstallationToken(privateKey)
  await dispatchWorkflow(installationToken)

  console.info('GitHub accepted the blog deployment request')
})
