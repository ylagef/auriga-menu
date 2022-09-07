import React, { useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

function Netlify() {
  useEffect(() => {
    console.log('Init netlify')
    netlifyIdentity.init({
      container: '#netlify-modal',
      locale: 'es'
    })

    netlifyIdentity.open()
    netlifyIdentity.on('init', (user) => console.log('init', user))
    netlifyIdentity.on('login', (user) => console.log('login', user))
    netlifyIdentity.on('logout', () => console.log('Logged out'))
    netlifyIdentity.on('error', (err) => console.error('Error', err))
    netlifyIdentity.on('open', () => console.log('Widget opened'))
    netlifyIdentity.on('close', () => console.log('Widget closed'))

    return () => {
      // Unbind from events
      netlifyIdentity.off('init')
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
      netlifyIdentity.off('error')
      netlifyIdentity.off('open')
      netlifyIdentity.off('close')
    }
  }, [])

  return <div id="netlify-modal" />
}

export default Netlify
