import { createContext } from 'react'
import { RadioValue } from '.'

export type RadioGroupType = 'basic' | 'solid'

export const RadioGroupContext = createContext<{
  value: RadioValue[]
  disabled: boolean
  check: (val: RadioValue) => void
  uncheck: (val: RadioValue) => void
  type: RadioGroupType
} | null>(null)
