import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter, contactUrl } from '@/components/site-footer'
import { RoadmapTimeline, REPO_URL } from '@/components/roadmap-timeline'
import './roadmap.css'

export const metadata: Metadata = {
  title: 'Roadmap — Holler',
  description:
    'What is live on Holler, what is being built now, and what comes next, with every shipped feature linked to its commit on GitHub.',
}

// CONTACT_URL and JOURNEY_TWEET_URL are read at request time so they can
// change without a code edit (same treatment the landing page gives Contact).
export const dynamic = 'force-dynamic'

export default function RoadmapPage() {
  const contactHref = contactUrl()
  const journeyTweetUrl = process.env.JOURNEY_TWEET_URL || ''
  return (
    <div className="rm-shell min-h-screen bg-hl-bg text-hl-fg">
      <SiteHeader />
      {/* The site's one column (the landing's 1280 with 64px gutters), no
          background art: it matches the home page (owner, 2026-11-16). */}
      <main className="rm-page">
        <header className="rm-intro">
          <h1>Roadmap</h1>
          <p>What’s live on Holler, what’s being built, and what comes next.</p>
          <a className="rm-repo" href={`${REPO_URL}/commits/v0-ui-migration`} target="_blank" rel="noopener noreferrer">
            Built in the open: every change is on GitHub <span aria-hidden="true">→</span>
          </a>
        </header>

        <RoadmapTimeline journeyTweetUrl={journeyTweetUrl} />

        <div className="rm-cta">
          <p>Want something bumped up the list?</p>
          <a href={contactHref} target="_blank" rel="noopener noreferrer">Tell us on X</a>
        </div>
      </main>
      <SiteFooter contactHref={contactHref} />
    </div>
  )
}
