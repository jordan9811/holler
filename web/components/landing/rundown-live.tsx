'use client'

import { useEffect } from 'react'

// The landing's rundown rail (landing.css, "Rundown rail"): marks the segment
// being read as live. Each .mcl-seg sits in its own section; the section that
// crosses the middle band of the viewport lights its marker. Nothing renders.
export function RundownLive() {
  useEffect(() => {
    const segs = Array.from(document.querySelectorAll<HTMLElement>('.mcl-seg'))
    if (!segs.length || typeof IntersectionObserver === 'undefined') return
    const byParent = new Map(segs.map((s) => [s.parentElement as Element, s]))
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        for (const s of segs) s.toggleAttribute('data-live', s === byParent.get(e.target))
      }
    }, { rootMargin: '-45% 0px -50% 0px' })
    byParent.forEach((_, parent) => io.observe(parent))
    return () => io.disconnect()
  }, [])
  return null
}
