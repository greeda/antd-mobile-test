import type { FC, ReactNode } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'
import type { FABItemProps } from './fab-item'

const classPrefix = `adm-fab`

// 기본 아이콘들
const DefaultIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 5V19M5 12H19'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const ActionIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7 14L12 9L17 14'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export type FABProps = {
  type?: 'default' | 'action'
  expanded?: boolean
  position?: 'left' | 'right'
  icon?: ReactNode
  children?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & NativeProps<
  '--z-index' | '--size' | '--border-radius' | '--background' | '--color'
>

const defaultProps = {
  type: 'default',
  expanded: true,
  position: 'right',
}

const FAB: FC<FABProps> = p => {
  const props = mergeProps(defaultProps, p)
  const [isOpen, setIsOpen] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  const hasChildren = React.Children.count(props.children) > 0
  const shouldShowExpanded = props.expanded && hasChildren

  // type에 따라 아이콘 결정 (메모이제이션으로 최적화)
  const icon = useMemo(() => {
    if (props.icon) {
      return props.icon
    }
    return props.type === 'action' ? <ActionIcon /> : <DefaultIcon />
  }, [props.icon, props.type])

  const handleMainClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (props.type === 'action') {
      props.onClick?.(event)
    } else if (shouldShowExpanded) {
      setIsOpen(!isOpen)
    }
  }

  const handleItemClick = (
    itemOnClick?: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void
  ) => {
    return (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      itemOnClick?.(event)
      setIsOpen(false)
    }
  }

  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return withNativeProps(
    props,
    <div
      className={`${classPrefix} ${classPrefix}-${props.position} ${classPrefix}-${props.type}`}
      ref={fabRef}
    >
      {/* FAB Items */}
      {shouldShowExpanded && (
        <div
          className={`${classPrefix}-items ${isOpen ? `${classPrefix}-items-open` : ''}`}
        >
          {React.Children.map(props.children, (child, index) => {
            if (React.isValidElement<FABItemProps>(child)) {
              return (
                <div key={index} className={`${classPrefix}-item-wrapper`}>
                  {React.cloneElement(child, {
                    onClick: handleItemClick(child.props.onClick),
                  })}
                </div>
              )
            }
            return child
          })}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        type='button'
        className={`${classPrefix}-main`}
        onClick={handleMainClick}
      >
        {icon}
      </button>
    </div>
  )
}

export { FAB }
