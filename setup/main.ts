import { defineAppSetup } from '@slidev/types'
import { inject } from '@vercel/analytics'

// Vercel Web Analytics. Every slide has its own URL (/1 … /9), so each
// slide a visitor reaches is recorded as a page view: the Pages report
// shows how far into the deck people get.
// Slidev's own tooling routes (presenter, overview, export…) are
// dropped so rehearsing or exporting doesn't inflate the numbers.
const internal = /^\/(?:presenter|overview|export|notes|entry|print)(?:\/|$)/

export default defineAppSetup(() => {
  if (typeof window === 'undefined')
    return

  inject({
    beforeSend(event) {
      const url = new URL(event.url)
      if (internal.test(url.pathname) || url.searchParams.has('print'))
        return null
      return event
    },
  })
})
