import posthog from 'posthog-js'
import { useEffect } from 'react'

export default function PostHog() {
  useEffect(() => {
    posthog.init(import.meta.env.PUBLIC_PH_API_KEY, {
      autocapture: true,
      persistence: 'memory'
    })
  }, [])

  return null
}
