import { clientEntry, type Handle } from 'remix/ui'

export const ImpressionTracker = clientEntry(
  import.meta.url + '#ImpressionTracker',
  function ImpressionTracker(handle: Handle<{ endpoint: string }>) {
    return () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return null
      if (sessionStorage.getItem('impression_tracked')) return null
      sessionStorage.setItem('impression_tracked', '1')

      const body = JSON.stringify({
        url: window.location.href,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
      })

      if (navigator.sendBeacon) {
        navigator.sendBeacon(handle.props.endpoint, body)
      } else {
        fetch(handle.props.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }

      return null
    }
  },
)
