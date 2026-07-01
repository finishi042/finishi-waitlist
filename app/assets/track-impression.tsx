import { clientEntry, type Handle } from 'remix/ui'

// Track page impression by sending a beacon to the server
export const ImpressionTracker = clientEntry(
  import.meta.url + '#ImpressionTracker',
  function ImpressionTracker(handle: Handle<{ endpoint: string }>) {
    let tracked = false

    return () => {
      // Track once per page load
      if (!tracked && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        tracked = true
        const { endpoint } = handle.props

        // Use sendBeacon for reliable tracking even if user navigates away
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, JSON.stringify({
            url: window.location.href,
            referrer: document.referrer || null,
            timestamp: new Date().toISOString(),
          }))
        } else {
          // Fallback to fetch for older browsers
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: window.location.href,
              referrer: document.referrer || null,
              timestamp: new Date().toISOString(),
            }),
            keepalive: true,
          }).catch(() => {
            // Silently fail - don't block page load
          })
        }
      }

      return null
    }
  },
)
