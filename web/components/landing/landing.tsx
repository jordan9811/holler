import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import type { PublicRoomCard } from '@/lib/api'
import type { BountyPool } from '@/lib/bounty-api'
import { formatDollars } from '@/lib/display-format'
import { BrandText } from '@/components/brand-text'
import { ThemeToggle } from '@/components/theme-toggle'
import { docsUrl } from '@/lib/docs-url.mjs'
import { PoolThumb } from './pool-thumb'
import { LandingHero } from './landing-hero'
import { WaysIn } from './ways-in'
import { RundownLive } from './rundown-live'
import './landing.css'

// What keeps it fair, one line of checks under the three ways. Each is true of the code
// today: every Holler clears the room's moderation (a person, or the
// automatic check in an auto-moderated room); unpaid pledges and unspent
// campaign budgets are refunded; payouts settle in USDC; a bounty pays only a
// streamer who proves the channel on air (bounty-claim.config.js). "Instant"
// was left off on purpose: a bounty pays on a verified broadcast, not at once.
const TRUST = [
  { title: 'Every Holler checked', rest: ' before it airs' },
  { title: 'Unused money comes back', rest: '' },
  { title: 'Paid in USDC', rest: ', straight to your wallet' },
  { title: 'Verified streamers', rest: ' collect bounties' },
] as const

// Starting points for a streamer's first campaign, after the form's own
// examples (campaign-form.tsx PLACEHOLDER).
// Owner's picks, 2026-11-13: one prize, places, the followed-by rule ("mutual
// follows": accounts the streamer follows that follow the viewer), and a
// verified-follower minimum (minVerifiedFollowers). Four rows, like the bounty board.
// Keyed by the feature's colour tab AND its name (owner, 2026-11-16: the tab
// alone does not say what it means).
const CAMPAIGN_IDEAS = [
  { kind: 'holler', title: 'Funniest Holler tonight wins', detail: 'one prize, you pick', price: '$50' },
  { kind: 'callin', title: 'Top 3 hot takes', detail: '1st $30, 2nd $15, 3rd $5', price: '$50' },
  { kind: 'callin', title: '5 mutual follows? Get paid to call in', detail: 'followed by 5 people I follow', price: '$3' },
  { kind: 'holler', title: '1,000+ verified followers? Get paid to Holler', detail: 'the first 50 that air', price: '$2' },
] as const

const PLATFORM_NAME: Record<string, string> = { twitch: 'Twitch', kick: 'Kick', x: 'X', youtube: 'YouTube', pumpfun: 'pump.fun' }

/** One tally marker for V1 (Classic) only (landing.css). Decoration: hidden from AT. */
function Seg({ n, name }: { n: string; name: string }) {
  return (
    <span className="mcl-seg" aria-hidden="true">
      <span className="mcl-seg-tally"><b>{n}</b><small><i>On air</i><span>{name}</span></small></span>
      <span className="mcl-crop" data-side="l" /><span className="mcl-crop" data-side="r" />
    </span>
  )
}

function poolHref(pool: BountyPool): string {
  return pool.platform && pool.handle
    ? `/bounty/s/${encodeURIComponent(pool.platform)}/${encodeURIComponent(pool.handle)}`
    : '/bounty'
}


export function Landing({
  rooms: _rooms,
  pools,
  contactHref,
}: {
  rooms: PublicRoomCard[]
  pools: BountyPool[]
  contactHref: string
}) {
  const boardPools = [...pools].sort((a, b) => b.remaining - a.remaining).slice(0, 4)
  return (
    <div className="mc-landing min-h-screen">
      <header className="mcl-nav">
        <Link href="/?stay=1" className="mcl-brand"><BrandText /></Link>
        <nav aria-label="Primary" className="mcl-nav-links">
          <Link href="/app" className="hidden sm:inline">Rooms</Link>
          <Link href="/bounty" className="hidden sm:inline">Bounties</Link>
          <Link href="/how-it-works" className="hidden md:inline">How it works</Link>
          <ThemeToggle />
          <Link href="/app" className="mcl-nav-cta">Enter app</Link>
        </nav>
      </header>

      <LandingHero />

      <main>
        {/* Polish C (owner, 2026-11-16): one 1280 column. The three ways, one
            line of what keeps it fair, then each pitch as its own band: copy
            left, board right, stacked below 1100. */}
        {/* The margins (owner, 2026-11-16): lit seams between bands in both
            looks; V1 (Classic) also keeps a tally rail of big numerals with the
            live one lit, plus crop marks, on wide screens (landing.css). */}
        <div className="mcl-run">
        <RundownLive />
        <div className="mcl-duo">
          <Seg n="01" name="The ways" />
          <WaysIn />
          <ul className="mcl-trust" aria-label="How Holler keeps it fair">
            {TRUST.map(({ title, rest }) => (
              <li key={title}><Check size={16} strokeWidth={2.25} aria-hidden="true" /><span><strong>{title}</strong>{rest}</span></li>
            ))}
          </ul>
        </div>

        {/* .dark: the boards stay at night in light mode too (Stone) */}
        <section className="mcl-bounty mcl-boards dark">
          <div className="mcl-half" data-k="bounty">
            <Seg n="02" name="Bounties" />
            <div className="mcl-bounty-poster">
              <small className="mcl-band-k">Bounties</small>
              <h2>Your favorite streamer doesn&apos;t even know you.</h2>
              <p>Be more than a username. Pledge toward a bounty, and the streamer collects it by going live with Holler.</p>
              <Link href="/bounty">Pledge your favorite streamer</Link>
            </div>
            <div className="mcl-mini-board">
              <header><span><strong>Top bounties</strong>{boardPools.some((p) => p.displayOnly) ? <small>Examples</small> : null}</span><Link href="/bounty">Full board <ArrowRight size={14} aria-hidden="true" /></Link></header>
              {boardPools.length > 0 ? boardPools.map((pool, index) => (
                <Link key={pool.handleKey} href={poolHref(pool)} className="mcl-pool-row">
                  <span>{index + 1}</span>
                  <PoolThumb handle={pool.handle || pool.handleKey} platform={pool.platform} avatarUrl={pool.avatarUrl} />
                  <p><strong>{pool.handle || pool.handleKey}</strong>{pool.contributionCount > 0 ? <small>{pool.contributionCount} backer{pool.contributionCount === 1 ? '' : 's'}</small> : null}</p>
                  <em>{PLATFORM_NAME[pool.platform || ''] || pool.platform || 'Unlisted'}</em>
                  <b>{formatDollars(pool.remaining)}</b>
                </Link>
              )) : (
                <div className="mcl-pool-empty">
                  <strong>No active bounties.</strong>
                  <span>Create one for any streamer.</span>
                  <Link href="/bounty">Create a bounty</Link>
                </div>
              )}
            </div>
          </div>

          {/* Campaigns: the streamer pays viewers for engagement (campaign-engine.js).
              There is no public list of campaigns, so the board is starting
              points: each opens the new-campaign form. */}
          <div className="mcl-half" data-k="campaign">
            <Seg n="03" name="Campaigns" />
            <div className="mcl-bounty-poster">
              <small className="mcl-band-k">Campaigns</small>
              <h2>New to streaming? Grow your audience with Holler.</h2>
              <p>Pay viewers to Holler or call in. Set who qualifies; you only pay for what counts, and the rest comes back.</p>
              <Link href="/dashboard/campaigns/new">Start a campaign</Link>
            </div>
            <div className="mcl-mini-board">
              <header><span><strong>Campaigns to try</strong><small>Examples</small></span><Link href="/dashboard/campaigns">Your campaigns <ArrowRight size={14} aria-hidden="true" /></Link></header>
              {CAMPAIGN_IDEAS.map((c) => (
                <Link key={c.title} href="/dashboard/campaigns/new" className="mcl-pool-row mcl-idea-row" data-kind={c.kind}>
                  <span aria-hidden="true" />
                  <p><strong>{c.title}</strong><small><b>{c.kind === 'holler' ? 'Holler' : 'Call in'}</b> · {c.detail}</small></p>
                  <b>{c.price}</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </div>

        {/* .dark: from the boards down the page stays at night in light mode too,
            so it never goes light, dark, light again (owner, 2026-11-16) */}
        <section className="mcl-create-strip mcl-night dark">
          <div><h2>Create a room.</h2><p>Set your rate, connect OBS, and decide how viewers can join.</p></div>
          <Link href="/dashboard">Create room <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </main>

      <footer className="mcl-footer mcl-night dark">
        <span><BrandText /></span>
        <nav aria-label="Footer">
          <Link href="/app">Rooms</Link>
          <Link href="/bounty">Bounties</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/roadmap">Roadmap</Link>
          {docsUrl() ? <a href={docsUrl() as string}>Docs</a> : null}
          <a href={contactHref} target="_blank" rel="noreferrer">Contact</a>
        </nav>
      </footer>
    </div>
  )
}
