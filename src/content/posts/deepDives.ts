import type { Post } from '../types'

/** Deep Dives — long-form looks at architecture, markets, and mechanics. */
export const DEEP_DIVES: Post[] = [
  {
    slug: 'multiply-one-transaction',
    title: 'How Kamino Multiply builds a leveraged position in one transaction',
    category: 'deep-dives',
    tags: ['Multiply', 'Leverage', 'Architecture'],
    authors: ['daniel-roux'],
    publishedAt: '2026-07-15',
    excerpt:
      'One tap creates a leveraged position that would otherwise take a loop of deposits, borrows, and swaps. Here is the machinery that makes it atomic.',
    cover: { variant: 2 },
    coverImageUrl: '/illustrations/kamino-mark.png',
    seo: {
      description:
        'A technical look at how Kamino Multiply composes a flash loan, a swap, and a deposit into a single atomic transaction.',
    },
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'Leverage onchain used to be a chore: deposit collateral, borrow against it, swap the borrow back into more collateral, deposit again, and repeat until you hit your target. Every step is a transaction, a fee, and a chance for the price to move against you. Kamino Multiply does the whole loop in one tap. This is how.',
      },
      { _type: 'heading', level: 2, text: 'The problem with looping', id: 'the-problem' },
      {
        _type: 'paragraph',
        text: 'Say you want 3× exposure to an asset. Done manually, you would deposit, borrow ~65% of that value, swap it, deposit again, and keep going. Five or six round trips later you are close to target — having paid gas and swap fees at every step and carried open, half-built positions the entire time.',
      },
      {
        _type: 'callout',
        tone: 'warning',
        title: 'Why the half-built state is dangerous',
        text: 'Between steps, your position is under-collateralized relative to your intent. A sharp move mid-loop can liquidate you before the position is even finished. Atomicity removes that window entirely.',
      },
      { _type: 'heading', level: 2, text: 'Collapse the loop with a flash loan', id: 'flash-loan' },
      {
        _type: 'paragraph',
        text: 'Instead of looping, Multiply borrows the *entire* target amount up front with a flash loan, builds the final position, and repays the flash loan from the newly-created debt — all inside a single transaction that either completes fully or reverts.',
      },
      {
        _type: 'list',
        style: 'number',
        items: [
          'Flash-borrow the full leverage amount in the debt asset.',
          'Swap it into the collateral asset through Kamino Swap for best execution.',
          'Deposit your principal plus the swapped collateral into the market.',
          'Borrow against the combined collateral to repay the flash loan.',
        ],
      },
      {
        _type: 'paragraph',
        text: 'If any step fails — the swap slips past tolerance, the borrow would breach the market’s limits — the whole transaction reverts and you are left exactly as you started. There is no partially-built position to unwind.',
      },
      {
        _type: 'code',
        language: 'ts',
        filename: 'multiply.ts',
        code: `// Simplified: one atomic instruction bundle, not a multi-tx loop.
const tx = await kamino.multiply({
  market,
  collateral: 'JitoSOL',
  principal: 100,          // what the user brings
  leverage: 3,             // target exposure
  maxSlippageBps: 30,      // swap tolerance; overshoot => revert
})

// Under the hood, in order, inside a single transaction:
//   flashBorrow(debt)  ->  swap(debt -> collateral)
//   deposit(principal + collateral)  ->  borrow(debt)  ->  repayFlash()
await tx.signAndSend()`,
      },
      { _type: 'heading', level: 2, text: 'Why the swap routing matters', id: 'swap-routing' },
      {
        _type: 'paragraph',
        text: 'The swap in step two is where a naive implementation leaks value. Multiply routes through **Kamino Swap**, which aggregates liquidity across venues to minimize price impact on the (often large) leverage trade. Better execution there flows straight through to a better entry price for the whole position.',
      },
      {
        _type: 'table',
        head: ['Approach', 'Transactions', 'Exposure while building', 'Failure mode'],
        rows: [
          ['Manual loop', '5–6', 'Under-collateralized mid-loop', 'Partial position to unwind'],
          ['Kamino Multiply', '1', 'None — atomic', 'Clean revert, no state change'],
        ],
      },
      {
        _type: 'quote',
        text: 'Atomicity is the feature. Everything else — fewer fees, one signature — falls out of doing the whole thing in a single transaction that can’t half-finish.',
        attribution: 'Daniel Roux',
        source: 'Protocol Engineering, Kamino',
      },
      { _type: 'divider' },
      {
        _type: 'paragraph',
        text: 'Unwinding works the same way in reverse: flash-repay the debt, withdraw collateral, swap back, settle. One tap, one transaction, no dangling state. That symmetry is what lets Multiply present leverage as a single number you dial up or down, rather than a process you manage.',
      },
    ],
  },
  {
    slug: 'integrating-new-stablecoins',
    title: 'Adding new stablecoins: how Kamino integrates Ethena and Global Dollar Network',
    category: 'deep-dives',
    tags: ['Stablecoins', 'Architecture', 'Integrations'],
    authors: ['priya-nair'],
    publishedAt: '2026-06-24',
    excerpt:
      'Listing a new stablecoin is not a config change. It is a pricing problem, a risk problem, and a liquidity problem — solved in that order.',
    cover: { variant: 3 },
    coverImageUrl: '/illustrations/ethena-gdn.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'When Kamino added USDe from Ethena and USDG from Global Dollar Network, the visible change was two new options in the app. The invisible work was three problems solved in order: how to price it, how to risk it, and how to give it somewhere to trade.',
      },
      { _type: 'heading', level: 2, text: 'Pricing before anything else', id: 'pricing' },
      {
        _type: 'paragraph',
        text: 'A stablecoin is only worth its peg until it isn’t. Before either asset could be collateral, it had to price through Kamino’s oracle architecture — aggregated feeds with confidence bounds, so a single wobble on one venue can’t drag a whole market with it.',
      },
      {
        _type: 'image',
        src: '/illustrations/stablecoin-yield.png',
        alt: 'Kamino stablecoin yield',
        caption: 'New stablecoins slot into the same Earn surface as the rest — priced and risked the same way.',
        width: 'wide',
      },
      { _type: 'heading', level: 2, text: 'Risk in isolation, then integration', id: 'risk' },
      {
        _type: 'list',
        style: 'bullet',
        items: [
          '**Start isolated.** Each new stablecoin launches in a market scoped to itself, so its risk is contained while it earns a track record.',
          '**Set conservative caps.** Supply and borrow caps start low and rise as depth and history build.',
          '**Graduate carefully.** Only once a peg has held through real volatility does an asset earn broader integration.',
        ],
      },
      {
        _type: 'callout',
        tone: 'info',
        title: 'Two different designs, one framework',
        text: 'USDe and USDG maintain their pegs in very different ways. The integration framework doesn’t care about the mechanism — it cares about the price, the depth, and the history, measured the same way for both.',
      },
    ],
  },
  {
    slug: 'allez-vault-risk-framework',
    title: 'Inside curated vaults: the Allez risk framework',
    category: 'deep-dives',
    tags: ['Vaults', 'Risk', 'Curators'],
    authors: ['priya-nair'],
    publishedAt: '2026-05-13',
    excerpt:
      'A curated vault is only as good as the framework behind it. Allez publishes theirs — here is how to read it, and why a named curator matters.',
    cover: { variant: 4 },
    coverImageUrl: '/illustrations/allez.png',
    body: [
      {
        _type: 'paragraph',
        variant: 'lead',
        text: 'A lending vault makes one promise: your deposit is lent out carefully. “Carefully” is doing a lot of work in that sentence. Curated vaults exist to make it legible — a named curator, Allez, sets and publishes the rules the vault lives by.',
      },
      {
        _type: 'paragraph',
        text: 'That is the difference between a black box and a framework you can actually read before you deposit.',
      },
      {
        _type: 'heading', level: 2, text: 'What a curator actually decides', id: 'what-a-curator-decides',
      },
      {
        _type: 'table',
        head: ['Decision', 'What it controls'],
        rows: [
          ['Eligible collateral', 'Which assets the vault will lend against'],
          ['Supply & borrow caps', 'How much exposure to any one market'],
          ['Liquidation thresholds', 'How much buffer before a position is unwound'],
          ['Oracle sources', 'Which price feeds the vault trusts'],
        ],
      },
      {
        _type: 'callout',
        tone: 'success',
        text: 'Every parameter is published and versioned. When the framework changes, the change is visible — you are never re-underwritten silently.',
      },
      {
        _type: 'paragraph',
        text: 'A named curator also means accountability. There is a team whose reputation rides on the vault performing as described — which is exactly the incentive you want standing behind your deposit.',
      },
    ],
  },
]
