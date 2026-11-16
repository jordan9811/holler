// Generate the Holler brand rasters and save them to web/public/, in the
// default (Retro) look: lowercase "holler" in Outfit, the o a round SMPTE
// test card, flat colour on warm studio black.
//   og.png              1200x630 social card (every shared link's preview):
//                       the wordmark, large, with the tagline under it
//   holler-logo-dark.png  the wordmark on transparent, light letters — the
//   holler-logo-light.png Privy sign-in modal's logo, one per modal theme
//                       (appearance.logo in components/providers/privy-bridge.tsx)
//   apple-icon.png      180x180 home-screen icon: the o alone (the test card,
//                       hairline edge) on studio black
// web/public/icon.svg (the tab icon) is hand-drawn to the same proportions:
// a test card edged by a thin warm-black ring.
// The test card is drawn with the SAME .hm-tc CSS the site uses (read out of
// web/app/globals.css), so the rasters cannot drift from the component.
// Re-run whenever the brand look changes, then bump ?v= on /og.png in
// web/app/layout.tsx and web/app/c/[slug]/page.tsx (link previews cache by URL):
//   node scripts/generate-og.mjs
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'fs';

const globals = readFileSync('web/app/globals.css', 'utf8');
const tc = globals.match(/\.hm \.hm-tc \{[\s\S]*?\n\}/);
if (!tc) throw new Error('could not find the .hm-tc rule in web/app/globals.css');

const FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=block';
// The wordmark exactly as .hm-retro sets it (globals.css, Retro look).
const base = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .hm { display: inline-flex; font-family: 'Outfit', sans-serif; }
  .hm-retro { display: inline-flex; align-items: baseline; font-size: 1.62em; font-weight: 800; line-height: 1; letter-spacing: -0.035em; }
  ${tc[0]}
`;
const mark = `<span class="hm"><span class="hm-retro">h<span class="hm-tc"></span>ller</span></span>`;

const og = `<!doctype html><html><head><meta charset="utf-8">
<link href="${FONTS}" rel="stylesheet">
<style>${base}
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #0e0d0c; color: #f4efe6;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 34px;
    font-family: 'Outfit', sans-serif;
  }
  .hm { font-size: 152px; }
  .tag { color: #f4efe6; font-size: 54px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .tag span { color: #b6ad9f; }
</style></head><body>
  ${mark}
  <div class="tag">Skip the chat. <span>Be the stream.</span></div>
</body></html>`;

const logo = (color) => `<!doctype html><html><head><meta charset="utf-8">
<link href="${FONTS}" rel="stylesheet">
<style>${base}
  html, body { background: transparent; }
  body { display: inline-block; padding: 4px; color: ${color}; }
  .hm { font-size: 56px; padding: 0.08em 0.12em; }
</style></head><body>${mark}</body></html>`;

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
async function render(html, width, height, path, { transparent = false, font = true } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: transparent ? 2 : 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => document.fonts.check('800 1em Outfit'));
  if (font && !ok) throw new Error('Outfit did not load — check the network, then re-run');
  await new Promise((r) => setTimeout(r, 300));
  // a transparent raster is cropped to the mark itself
  const clip = transparent
    ? await page.evaluate(() => { const r = document.querySelector('.hm').getBoundingClientRect(); return { x: Math.floor(r.x) - 2, y: Math.floor(r.y) - 2, width: Math.ceil(r.width) + 4, height: Math.ceil(r.height) + 4 } })
    : { x: 0, y: 0, width, height };
  await page.screenshot({ path, clip, omitBackground: transparent });
  await page.close();
  console.log(`wrote ${path} (${clip.width}x${clip.height})`);
}
await render(og, 1200, 630, 'web/public/og.png');
const appleIcon = `<!doctype html><html><head><meta charset="utf-8">
<link href="${FONTS}" rel="stylesheet">
<style>${base}
  body { width: 180px; height: 180px; overflow: hidden; background: #0e0d0c; color: #f4efe6; display: grid; place-items: center; }
  .hm { font-size: 150px; } /* the o is .53 × 1.62em ≈ 129px of 180 */
  .hm .hm-tc { margin: 0; top: 0; }
</style></head><body><span class="hm"><span class="hm-retro"><span class="hm-tc"></span></span></span></body></html>`;
await render(appleIcon, 180, 180, 'web/public/apple-icon.png', { font: false }); // no letters: nothing to load
await render(logo('#f4efe6'), 600, 200, 'web/public/holler-logo-dark.png', { transparent: true });
await render(logo('#15120e'), 600, 200, 'web/public/holler-logo-light.png', { transparent: true });
await browser.close();
