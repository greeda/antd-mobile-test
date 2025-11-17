import { createContext } from 'react'
import { CheckboxValue } from '.'

export type CheckboxGroupType = 'basic' | 'solid'

export const CheckboxGroupContext = createContext<{
  value: CheckboxValue[]
  disabled: boolean
  check: (val: CheckboxValue) => void
  uncheck: (val: CheckboxValue) => void
  type: CheckboxGroupType
} | null>(null)
