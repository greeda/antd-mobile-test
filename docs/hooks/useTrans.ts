import { context } from 'dumi/theme'
import React from 'react'

export function useTrans() {
  let locale = 'en'
  try {
    const ctx = React.useContext(context)
    locale = ctx?.locale || 'en'
  } catch (e) {
    console.warn('Failed to get locale from context:', e)
  }
  const isZh = locale === 'zh'

  function trans<T>(en: T, zh: T) {
    return isZh ? zh : en
  }

  trans.zh = isZh
  trans.en = !isZh

  return trans
}
