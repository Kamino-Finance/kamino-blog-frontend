import type { Post } from '../types'

/**
 * Announcements — launches, releases, and product news.
 *
 * Seed content for the self-contained build, mapped to the real Kamino
 * announcement banners in `public/illustrations/`. Marketing replaces/extends
 * these through Sanity at launch; the shape here matches what the adapter emits.
 */
export const ANNOUNCEMENTS: Post[] = [
  {
    slug: 'xpoints-live',
    title: 'xPoints are live on Kamino',
    category: 'announcements',
    tags: ['xPoints', 'Rewards', 'Tokenized Assets'],
    authors: ['maya-osei'],
    publishedAt: '2026-07-22',
    excerpt:
      'Earn xPoints for what you already do on Kamino — including trading tokenized stocks through xStocks. Here’s how the program works.',
    cover: { variant: 1 },
    coverImageUrl: '/illustrations/xstocks.png',
    featured: true,
    seo: {
      description:
        'xPoints are live on Kamino — a rewards program for supplying, borrowing, and trading tokenized stocks through xStocks.',
    },
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'xPoints are live. Starting today you earn points for the things you already do on Kamino — supplying, borrowing, and now trading tokenized stocks through xStocks — and redeem them each season.',
      },
      {
        _type: 'paragraph',
        text: 'The program launches alongside tokenized equities. Apple, Nvidia, a tokenized S&P 500 tracker, and a first set of blue-chip names are live through xStocks — priced onchain, settled onchain, and held in an account only you control. Trading them is one of the fastest ways to earn xPoints, and the exposure is the same asset you already understand; what changes is the rail underneath it.',
      },
      {
        _type: 'stat',
        items: [
          { value: '60+', label: 'Tokenized names at launch' },
          { value: '24/7', label: 'Trading, including weekends' },
          { value: 'T+0', label: 'Onchain settlement' },
        ],
      },
      { _type: 'heading', level: 2, text: 'What you can do today', id: 'what-you-can-do' },
      {
        _type: 'paragraph',
        text: 'Every tokenized equity behaves like the rest of your Kamino portfolio. You can **buy and sell** with USDC, **hold** alongside your stablecoin yield and crypto positions, and — for supported names — **borrow against** the position without selling it.',
      },
      {
        _type: 'list',
        style: 'bullet',
        items: [
          'Fund with a card or bank transfer and convert to USDC in the same flow.',
          'Buy any listed name from its asset page, with live onchain pricing.',
          'Track dividends where the issuer distributes them, paid in stablecoins.',
        ],
      },
      {
        _type: 'callout',
        tone: 'info',
        title: 'How pricing works',
        text: 'Tokenized equities are priced against the underlying via the issuer’s oracle feed, aggregated through Kamino’s in-house oracle architecture. When traditional markets are closed, prices reflect the last official close plus onchain order flow.',
      },
      { _type: 'heading', level: 2, text: 'Held in your own account', id: 'self-custody' },
      {
        _type: 'paragraph',
        text: 'Tokenized equities on Kamino are self-custodial. The token representing your position sits in your account, not on our balance sheet, and moves only when you sign for it. That is the whole point of settling onchain: ownership is provable and portable, and you are never asking permission to access your own holdings.',
      },
      {
        _type: 'quote',
        text: 'We want buying a share of a company to feel as ordinary as sending a message — and to settle with the finality of cash.',
        attribution: 'Maya Osei',
        source: 'Product, Kamino',
      },
      { _type: 'heading', level: 3, text: 'Part of a busy few months', id: 'busy-months' },
      {
        _type: 'paragraph',
        text: 'xStocks join a steady run of launches — fixed-rate borrowing, a new standard for stablecoin yield, and curated vaults crossing their first big milestones.',
      },
      {
        _type: 'gallery',
        items: [
          { src: '/illustrations/fixed-rates.png', alt: 'Fixed-rate borrowing announcement', caption: 'Fixed-rate borrowing' },
          { src: '/illustrations/stablecoin-yield.png', alt: 'A new standard for stablecoin yield', caption: 'A new standard for stablecoin yield' },
        ],
      },
      { _type: 'divider' },
      {
        _type: 'paragraph',
        text: 'Tokenized equities are the next asset class to come onto the same rails as our stablecoin yield, crypto markets, and tokenized real-world assets. More names — and more of what you can do with them — are landing over the coming weeks.',
      },
    ],
  },
  {
    slug: 'fixed-rate-borrowing',
    title: 'Fixed-rate borrowing is live',
    category: 'announcements',
    tags: ['Borrow', 'Fixed Rates', 'Product'],
    authors: ['daniel-roux'],
    publishedAt: '2026-06-30',
    excerpt:
      'Lock a rate and a term when you borrow on Kamino. Instead of watching a variable rate drift, you know the exact cost before you sign.',
    cover: { variant: 3 },
    coverImageUrl: '/illustrations/fixed-rates.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'You can now borrow on Kamino at a fixed rate for a fixed term. Pick the term, see the exact cost, and sign — the rate holds for the life of the loan.',
      },
      {
        _type: 'paragraph',
        text: 'Variable rates are the right tool for a lot of borrowing, but they ask you to hold a view on where rates go next. A fixed rate removes that question. It is the difference between borrow-and-monitor and borrow-and-forget.',
      },
      { _type: 'heading', level: 2, text: 'How it works', id: 'how-it-works' },
      {
        _type: 'list',
        style: 'number',
        items: [
          'Choose a market and the term you want — 30, 90, or 180 days at launch.',
          'Kamino quotes a fixed rate and the total interest in dollars, up front.',
          'Sign once. Repay any time before maturity; exit early for a transparent spread.',
        ],
      },
      {
        _type: 'callout',
        tone: 'success',
        text: 'Withdraw and repay always stay open. A fixed term sets your rate, not a lockup on your collateral.',
      },
      {
        _type: 'heading', level: 2, text: 'Where fixed rates fit', id: 'where-it-fits',
      },
      {
        _type: 'paragraph',
        text: 'Fixed-rate borrowing pairs naturally with a known-duration plan: financing a position you intend to hold for a quarter, or borrowing against collateral while you wait out a vesting schedule. You size the cost once and it does not move.',
      },
      {
        _type: 'table',
        head: ['', 'Variable rate', 'Fixed rate'],
        rows: [
          ['Cost certainty', 'Moves with the market', 'Locked for the term'],
          ['Best for', 'Open-ended borrowing', 'Known-duration plans'],
          ['Early exit', 'Anytime, no spread', 'Anytime, transparent spread'],
        ],
      },
    ],
  },
  {
    slug: 'stablecoin-yield-standard',
    title: 'A new standard for stablecoin yield',
    category: 'announcements',
    tags: ['Earn', 'Stablecoins', 'Yield'],
    authors: ['maya-osei', 'priya-nair'],
    publishedAt: '2026-05-20',
    excerpt:
      'Yield on your stablecoins that comes from overcollateralized lending, shown in dollars, with same-day access. No emissions, no lockups.',
    cover: { variant: 4 },
    coverImageUrl: '/illustrations/stablecoin-yield.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'We rebuilt how Earn presents stablecoin yield: where the return comes from, what it costs, and how fast you can get your money back — stated plainly, in dollars.',
      },
      {
        _type: 'paragraph',
        text: 'The yield itself is not new or exotic. Deposited stablecoins are lent against overcollateralized positions in Kamino’s markets, and the rate is set by borrowing demand. What is new is that you can see exactly that, without decoding a wall of acronyms.',
      },
      {
        _type: 'stat',
        items: [
          { value: '6.33%', label: 'Representative yield' },
          { value: 'Same-day', label: 'Withdrawal access' },
          { value: '$0', label: 'Emissions in the number' },
        ],
      },
      {
        _type: 'callout',
        tone: 'info',
        title: 'Where the yield comes from',
        text: 'Every dollar of yield traces to a borrower paying interest on an overcollateralized loan. It is not subsidised by a token emission, so the rate you see is the rate the market is actually paying.',
      },
    ],
  },
  {
    slug: 'vaults-one-million-interest',
    title: 'Curated vaults cross $1M in interest earned',
    category: 'announcements',
    tags: ['Vaults', 'Milestone', 'Earn'],
    authors: ['the-kamino-team'],
    publishedAt: '2026-05-06',
    excerpt:
      'The Allez-curated lending vaults have now paid out more than $1M in interest to depositors. A note on the milestone and what it signals.',
    cover: { variant: 2 },
    coverImageUrl: '/illustrations/allez-milestone.png',
    coverFocus: 'left',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'Depositors in the Allez-curated vaults on Kamino have now earned more than $1M in interest, all of it from real borrowing demand.',
      },
      {
        _type: 'paragraph',
        text: 'It is a small number next to traditional markets and a meaningful one for a set of vaults built the careful way: named curators, published risk frameworks, and yield that comes from overcollateralized lending rather than incentives.',
      },
      {
        _type: 'quote',
        text: 'A million dollars of interest is a million dollars someone chose to pay to borrow — that is the signal we care about.',
        attribution: 'The Kamino Team',
      },
    ],
  },
]
