import type { FC, ReactNode } from 'react'
import React from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'

const classPrefix = `adm-fab`

export type FABItemProps = {
  icon?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & NativeProps<'--background' | '--color' | '--border-radius'>

const FABItem: FC<FABItemProps> = p => {
  const props = mergeProps({}, p)

  return withNativeProps(
    props,
    <button
      type='button'
      className={`${classPrefix}-item`}
      onClick={props.onClick}
    >
      {props.icon && (
        <div className={`${classPrefix}-item-icon`}>{props.icon}</div>
      )}
    </button>
  )
}

export { FABItem }
