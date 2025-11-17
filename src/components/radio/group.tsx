import type { FC, ReactNode } from 'react'
import React from 'react'
import { RadioValue } from '.'
import { usePropsValue } from '../../utils/use-props-value'
import { mergeProps } from '../../utils/with-default-props'
import { RadioGroupContext, RadioGroupType } from './group-context'

export interface RadioGroupProps {
  value?: RadioValue | null
  onChange?: (val: RadioValue) => void
  defaultValue?: RadioValue | null
  disabled?: boolean
  children?: ReactNode
  type?: RadioGroupType
}

const defaultProps = {
  disabled: false,
  defaultValue: null,
  type: 'basic',
}

export const Group: FC<RadioGroupProps> = p => {
  const props = mergeProps(defaultProps, p)
  const [value, setValue] = usePropsValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: v => {
      if (v === null) return
      props.onChange?.(v)
    },
  })
  return (
    <RadioGroupContext.Provider
      // TODO: 性能优化
      value={{
        value: value === null ? [] : [value],
        check: v => {
          setValue(v)
        },
        uncheck: () => {},
        disabled: props.disabled,
        type: props.type,
      }}
    >
      {props.children}
    </RadioGroupContext.Provider>
  )
}
