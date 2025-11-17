import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'
import type { StepProps } from './step'

// Internal StepProps with selectable and anchorable (for Steps component use only)
type InternalStepProps = StepProps & {
  selectable?: boolean
  anchorable?: boolean
}

const classPrefix = `adm-steps`
const stepClassPrefix = `adm-step`

const defaultIcon = <span className={`${stepClassPrefix}-icon-dot`} />
const inlineIcon = <span className={`${stepClassPrefix}-icon-dot3333`} />

type Direction = 'horizontal' | 'vertical'

export type StepsProps = {
  current?: number
  direction?: Direction
  children?: ReactNode
  inline?: boolean
  type?: 'default' | 'card'
  selectable?: boolean
  anchorable?: boolean
  onStepSelect?: (index: number) => void
} & NativeProps<
  | '--title-font-size'
  | '--description-font-size'
  | '--indicator-margin-right'
  | '--icon-size'
>

const defaultProps = {
  current: 0,
  direction: 'horizontal',
  type: 'default',
  selectable: false,
  anchorable: false,
}

export const Steps: FC<StepsProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { direction, current, type, selectable, anchorable } = props
  const classString = classNames(classPrefix, `${classPrefix}-${direction}`)

  return withNativeProps(
    props,
    <div className={classString}>
      {React.Children.map(props.children, (child, index) => {
        if (!React.isValidElement<StepProps>(child)) {
          return child
        }
        const childProps = child.props
        let status = childProps.status || 'wait'

        if (index < current) {
          status = childProps.status || 'finish'
        } else if (index === current) {
          status = childProps.status || 'process'
        }

        const inlineEffective = childProps.inline ?? props.inline
        const resolvedIcon = inlineEffective
          ? inlineIcon
          : (childProps.icon ??
            (() => {
              switch (status) {
                case 'wait':
                  return defaultIcon
                case 'finish':
                  return defaultIcon
                case 'process':
                  return defaultIcon
                default:
                  return defaultIcon
              }
            })())

        return React.cloneElement(child, {
          status,
          icon: resolvedIcon,
          type: childProps.type ?? type,
          inline: childProps.inline ?? props.inline,
          selectable: selectable,
          anchorable: anchorable,
          onSelect: props.onStepSelect
            ? () => {
                props.onStepSelect?.(index)
              }
            : childProps.onSelect,
          selected: childProps.selected ?? index === current,
        } as InternalStepProps)
      })}
    </div>
  )
}
