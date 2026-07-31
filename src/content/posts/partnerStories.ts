import type { Post } from '../types'

/** Partner Stories — how issuers, institutions, and builders use Kamino. */
export const PARTNER_STORIES: Post[] = [
  {
    slug: 'solstice-launch',
    title: 'Solstice launches its market on Kamino',
    category: 'partner-stories',
    tags: ['Issuers', 'Markets', 'Partners'],
    authors: ['leo-fischer'],
    publishedAt: '2026-07-01',
    excerpt:
      'Solstice brought its stablecoin suite to Kamino as an isolated market — borrow, lend, and earn against eUSX and USX in one place. Here is how it came together.',
    cover: { variant: 1 },
    coverImageUrl: '/illustrations/solstice.png',
    seo: {
      description:
        'How Solstice launched its stablecoin market on Kamino using an isolated market with a published risk framework.',
    },
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'Solstice tokenized a suite of stablecoins. The token was only half the job — a stablecoin that just sits in a wallet is a screenshot of an asset. The team wanted holders to be able to *use* it: borrow against it, earn on it, plug it into the rest of onchain finance. So they launched a market on Kamino.',
      },
      {
        _type: 'paragraph',
        text: 'This is how it came together, and what it takes to make a new asset behave like a first-class citizen onchain.',
      },
      { _type: 'heading', level: 2, text: 'Start with an isolated market', id: 'isolated-market' },
      {
        _type: 'paragraph',
        text: 'Every new asset class carries risk the rest of the system should not inherit. So Solstice launched in an **isolated market**: a self-contained pool where the collateral, the debt asset, and the risk parameters are scoped to Solstice’s stablecoins alone. If anything ever went wrong with the asset, the blast radius stops at that market.',
      },
      {
        _type: 'callout',
        tone: 'info',
        title: 'Why isolation matters',
        text: 'A new asset has dependencies the blue-chip pools don’t — a younger price history, thinner liquidity, its own redemption mechanics. Isolating the market lets those be priced and contained without touching everything next door.',
      },
      {
        _type: 'stat',
        items: [
          { value: '6', label: 'Assets in the market at launch' },
          { value: 'eUSX / USX', label: 'Collateral and debt' },
          { value: '1', label: 'Isolated market, zero contagion' },
        ],
      },
      { _type: 'heading', level: 2, text: 'Make the token do work', id: 'token-does-work' },
      {
        _type: 'paragraph',
        text: 'With the market live, a holder could deposit Solstice stablecoins and borrow against them, or supply them to earn the borrow-side yield. That single capability is what turned a static holding into productive collateral — and it is what pulled liquidity in.',
      },
      {
        _type: 'embed',
        kind: 'tweet',
        url: 'https://x.com/kaminofinance',
        title: 'Solstice market is live on Kamino →',
      },
      {
        _type: 'quote',
        text: 'Kamino gave our token somewhere to go. The day borrowing went live, the asset stopped being a certificate and started being infrastructure.',
        attribution: 'A member of the Solstice team',
      },
      { _type: 'divider' },
      {
        _type: 'paragraph',
        text: 'Solstice is one issuer. The pattern generalizes: bring the asset onchain, launch an isolated market with a real risk framework, price it properly, and let it plug into the rest of onchain finance. If you are bringing an asset onchain, [talk to our team](mailto:institutional@kamino-foundation.com).',
      },
    ],
  },
  {
    slug: 'falconx-institutional-liquidity',
    title: 'FalconX brings institutional liquidity to Kamino',
    category: 'partner-stories',
    tags: ['Institutions', 'Liquidity', 'Partners'],
    authors: ['leo-fischer'],
    publishedAt: '2026-06-17',
    excerpt:
      'One of the largest digital-asset prime brokers is now routing liquidity into Kamino markets, tightening spreads for everyone who trades and borrows.',
    cover: { variant: 2 },
    coverImageUrl: '/illustrations/falconx.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'FalconX, a prime broker serving institutions across digital assets, is now providing liquidity into Kamino markets. For everyone using Kamino, that shows up as one thing: tighter execution.',
      },
      {
        _type: 'paragraph',
        text: 'Deeper liquidity behind a market means less price impact on a trade and a fairer rate on a swap. When an institution the size of FalconX participates, that depth compounds for every other participant — retail and institutional alike.',
      },
      {
        _type: 'callout',
        tone: 'info',
        title: 'Why it matters downstream',
        text: 'Better liquidity flows straight into Multiply and repay-with-collateral, which route their swaps through the same venues. A tighter market is a cheaper leveraged position.',
      },
      {
        _type: 'stat',
        items: [
          { value: 'Prime', label: 'Broker-grade liquidity' },
          { value: 'Tighter', label: 'Spreads on swaps' },
          { value: '24/7', label: 'Onchain, always open' },
        ],
      },
    ],
  },
  {
    slug: 'privy-onboarding',
    title: 'One-tap onboarding, powered by Privy',
    category: 'partner-stories',
    tags: ['Onboarding', 'Wallets', 'Partners'],
    authors: ['maya-osei'],
    publishedAt: '2026-05-28',
    excerpt:
      'New users can now create a self-custodial account with an email or a passkey — no seed phrase to write down — using embedded wallets from Privy.',
    cover: { variant: 3 },
    coverImageUrl: '/illustrations/privy.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'The hardest part of onchain finance has always been the first thirty seconds. We rebuilt them with Privy: a new user can now open a self-custodial account with an email or a passkey, and start in minutes.',
      },
      {
        _type: 'paragraph',
        text: 'The account is still fully self-custodial — keys are generated and held on the user’s device, not by us. What changes is that a first-time user is no longer asked to write down twelve words before they have done anything.',
      },
      {
        _type: 'callout',
        tone: 'success',
        title: 'Still your keys',
        text: 'Embedded wallets don’t change custody. The signing key stays on your device; Privy makes creating and recovering it feel like signing into any modern app.',
      },
      {
        _type: 'paragraph',
        text: 'For anyone who wants the traditional path, connecting an existing wallet or a hardware device still works exactly as before. The embedded route is a friendlier front door, not a replacement.',
      },
    ],
  },
]
