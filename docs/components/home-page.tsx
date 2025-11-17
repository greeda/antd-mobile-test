import React, { useEffect, Suspense } from 'react'
import Footer from './components/Footer'
import Main from './components/Main'
import styles from './home-page.less'

export default () => {
  useEffect(() => {
    try {
      const algoliaSearch: any =
        document.querySelector('.__dumi-default-search-input') || {}
      if (algoliaSearch.placeholder !== undefined) {
        algoliaSearch.placeholder = '搜索'
      }
    } catch (e) {
      console.warn('Failed to set algolia search placeholder:', e)
    }
  }, [])

  return (
    <div className={styles.homePage}>
      <Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        }
      >
        <Main />
        <Footer />
      </Suspense>
    </div>
  )
}
