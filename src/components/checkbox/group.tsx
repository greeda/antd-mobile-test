import type { FC, ReactNode } from 'react'
import React from 'react'
import { CheckboxValue } from '.'
import { usePropsValue } from '../../utils/use-props-value'
import { mergeProps } from '../../utils/with-default-props'
import { CheckboxGroupContext, CheckboxGroupType } from './group-context'

export interface CheckboxGroupProps {
  value?: CheckboxValue[]
  onChange?: (val: CheckboxValue[]) => void
  defaultValue?: CheckboxValue[]
  disabled?: boolean
  children?: ReactNode
  type?: CheckboxGroupType
}

const defaultProps = {
  disabled: false,
  defaultValue: [],
  type: 'basic',
}

export const Group: FC<CheckboxGroupProps> = p => {
  const props = mergeProps(defaultProps, p)
  const [value, setValue] = usePropsValue(props)

  return (
    <CheckboxGroupContext.Provider
      // TODO: 性能优化
      value={{
        value: value,
        disabled: props.disabled,
        check: v => {
          setValue([...value, v])
        },
        uncheck: v => {
          setValue(value.filter(item => item !== v))
        },
        type: props.type,
      }}
    >
      {props.children}
    </CheckboxGroupContext.Provider>
  )
}
