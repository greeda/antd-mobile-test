import classNames from 'classnames'
import type { FC, MouseEvent, ReactNode } from 'react'
import React from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'

const classPrefix = `adm-step`

export type StepProps = {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  status?: 'wait' | 'process' | 'finish' | 'error'
  // new optional props for styling/behavior
  type?: 'default' | 'card'
  selected?: boolean
  inline?: boolean
  onSelect?: (e: MouseEvent<HTMLButtonElement>) => void
} & NativeProps

// Internal props used by Steps component only (not exported to prevent direct usage)
type InternalStepProps = StepProps & {
  selectable?: boolean
  anchorable?: boolean
}

// Utility component to render different HTML tags based on conditions
type StepWrapperProps = {
  anchorable?: boolean
  selectable?: boolean
  selected?: boolean
  onSelect?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  children: ReactNode
}

const StepWrapper: FC<StepWrapperProps> = ({
  anchorable,
  selectable,
  selected,
  onSelect,
  className,
  children,
}) => {
  if (anchorable) {
    return <a className={className}>{children}</a>
  }
  if (selectable) {
    return (
      <button
        type='button'
        className={className}
        aria-pressed={!!selected}
        onClick={onSelect}
      >
        {children}
      </button>
    )
  }
  return <div className={className}>{children}</div>
}

export const Step: FC<StepProps> = props => {
  // Type assertion for internal props that Steps component injects
  const internalProps = props as InternalStepProps
  const {
    title,
    description,
    icon,
    status = 'wait',
    selectable,
    anchorable,
    selected,
    onSelect,
  } = internalProps

  const baseClassName = classNames(
    `${classPrefix}`,
    `${classPrefix}-status-${status}`,
    anchorable && 'adm-step-anchor',
    selectable && 'adm-step-button'
  )

  const innerContent = (
    <>
      <div className={`${classPrefix}-indicator`}>
        <div className={`${classPrefix}-icon-container`}>{icon}</div>
      </div>
      <div className={`${classPrefix}-content`}>
        <div className={`${classPrefix}-title`}>{title}</div>
        {!!description && (
          <div className={`${classPrefix}-description`}>{description}</div>
        )}
      </div>
    </>
  )

  return withNativeProps(
    props,
    <StepWrapper
      anchorable={anchorable}
      selectable={selectable}
      selected={selected}
      onSelect={onSelect}
      className={baseClassName}
    >
      {innerContent}
    </StepWrapper>
  )
}
