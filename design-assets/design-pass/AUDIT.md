# Design pass, Phase 1: audit (2026-11-16)

App run locally: `npm run build`, then the server through the gate harness
(`startGateServer`, live keys blanked, seeded data: a streamer @latedesk with
a room and a funded prize campaign; signed in with minted credentials) at
**http://localhost:3410**. Normal local dev is `npm run dev` on :3000.
Screenshots: `before/NN-page-1440.png`, full page, 1440 wide, V2 look, light
mode. Advisor: Fable 5.2 reviewed the same screenshots independently (it was
not shown this list); its ranking agreed on 8 of 10.

## Pages (user-facing)

| Route | Page |
|---|---|
| `/` | Home (landing) |
| `/app` | Rooms board |
| `/how-it-works` | How it works |
| `/roadmap` | Roadmap |
| `/bounty` | Bounties board |
| `/bounty/s/:platform/:handle` | One streamer's bounty |
| `/bounty/mine` | My pledges |
| `/c/:slug` | Public campaign page |
| `/join`, `/:handle` | Room page (viewer) |
| `/account` | Account |
| `/dashboard` | Room dashboard (streamer) |
| `/dashboard/campaigns` | Campaigns list |
| `/dashboard/campaigns/new` | Create campaign |
| `/dashboard/campaigns/:id` | Campaign detail |
| `/dashboard/campaigns/:id/edit` | Edit campaign |

Not audited (internal or not a page people read): `/bounty/admin`, `/dev`,
`/dashboard/design-system`, `/legacy`, `/overlay` (transparent OBS source).

## The system, measured (web/app + web/components, 122 files)

48 distinct font sizes (the most used: 13, 12, 10, 11, 14, 9, 12.5px), 85
distinct hex colours, 211 gradients, 150 box-shadows, 10 font weights, 15
corner radii.

## Top 10 problems, ranked by impact

1. **No common page frame** (every page). Four content widths: full-bleed
   (rooms, bounties, account, room page), ~1180 (dashboard, campaigns),
   ~1100 (roadmap), ~850 (public campaign). Three container styles: square
   hairline frames (how it works, bounties, account, room page), rounded
   shadowed cards (dashboard, campaigns), none (my pledges, bounty streamer).
   Three different headers (home, rooms board, the shared site header). Each
   page reads as a different product, so nothing learned on one page carries
   to the next.
2. **Colour means three things at once** (every page). Blue is Call in and
   also the generic action (Sign in, Create room, Try demo, links); green is
   Campaigns/Rewards and also "locked" bounty money and the GREEN ONLY tier;
   yellow is Bounty and also YELLOW OK and warning boxes. Home has five
   different coloured primary buttons. A newcomer can't tell a feature from a
   status, and no button is clearly the first one.
3. **Too many type styles** (every page). 48 sizes and 10 weights; tiny
   letter-spaced mono caps labels (ROOM NAME, AVAILABLE BALANCE, SHARE ON X,
   WHO QUALIFIES, PUBLIC PAGE · PREVIEW) sit beside sans caps labels and two
   helper-text sizes. The eye can't tell a label from a value from a heading
   by size alone.
4. **One pill for six jobs** (most pages). The mono caps pill is a feature tag
   (HOLLER), a status (LIVE, OFFLINE), a page label in the header (BOUNTIES,
   MY PLEDGES), a tier (GREEN ONLY), a count (0 CLIPS READY TO AIR) and a
   legend (Refundable). Pills catch the eye first and teach nothing consistent.
5. **Money has no single treatment** (home, rooms, bounties, campaigns). Olive
   display face on bounties, yellow mono on the rooms board, green on the home
   campaign list, plain grey in the campaigns table, olive again on campaign
   detail. The number people care most about never looks the same twice.
6. **Bounties board: the least useful element dominates** (`/bounty`). Ten
   full-width progress bars and ten identical "View bounty" buttons outweigh
   the amounts, which sit small under the bars; a three-part legend with info
   icons has to be decoded before row one.
7. **Dashboard is upside down and lopsided** (`/dashboard`). The live queue
   (On camera, Hollers) is at the bottom, under the tile-position editor,
   which takes the most area; room status is one small grey line; the left
   column ends ~1,000px before the right; the Follow-my-stream card has no
   heading.
8. **Sparse pages are abandoned top-left** (`/bounty/mine`,
   `/bounty/s/...`, `/dashboard/campaigns/:id/edit`, `/dashboard/campaigns`,
   `/account`, rooms board). A large headline over one line or one short card,
   60% of the canvas empty; the rooms board ends on a "Claimed pledges"
   heading with nothing under it.
9. **Emphasis is inverted** (`/account`, `/how-it-works`, campaign detail).
   On account the largest text is "@handle" in a gradient hero and then "Not
   connected" (an empty state) at 44px; on how it works all 12 steps and 7
   FAQs are collapsed, so the readable content is four pills and a mid-page
   "camera seat" box; campaign detail crams an overlay warning, the status
   line, a 4-step progress rail and five stats into one card while "Who
   qualifies" sits mostly empty beside it.
10. **Create campaign is a wall** (`/dashboard/campaigns/new`). All 15 rule
    toggles open at equal weight, card edges in different feature colours
    whose meaning isn't explained, helper text at three sizes; the preview
    column ends a third of the way down.

Checked and dropped: the create form's save bar appearing to cover the Budget
row is a full-page-capture artefact of a sticky bar, not a live overlap.

Also seen everywhere, folded into 1 to 3: corner colour washes (blue on
account, yellow on bounties, blue haze top-left of campaigns pages) tint the
same card differently page to page.
