import { animated, useSpring } from '@react-spring/web'
import type { FC, ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'

const classPrefix = `adm-fab`

export type FABProps = {
  children?: ReactNode
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
} & NativeProps<
  '--z-index' | '--size' | '--border-radius' | '--background' | '--color'
>

export type FABItemProps = {
  icon?: ReactNode
  label?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  disabled?: boolean
} & NativeProps<'--background' | '--color' | '--border-radius'>

const defaultProps = {
  position: 'bottom-right',
}

export const FAB: FC<FABProps> & { Item: FC<FABItemProps> } = p => {
  const props = mergeProps(defaultProps, p)
  const [isOpen, setIsOpen] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  const { scale, rotate } = useSpring({
    scale: isOpen ? 1 : 0,
    rotate: isOpen ? 45 : 0,
  })

  const handleMainClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setIsOpen(!isOpen)
    props.onClick?.(event)
  }

  const handleItemClick = (
    itemOnClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  ) => {
    return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
      className={`${classPrefix} ${classPrefix}-${props.position}`}
      ref={fabRef}
    >
      {/* FAB Items */}
      <div className={`${classPrefix}-items`}>
        {React.Children.map(props.children, (child, index) => {
          if (React.isValidElement<FABItemProps>(child)) {
            return (
              <animated.div
                key={index}
                style={{
                  transform: scale.to(s => `scale(${s})`),
                  opacity: scale,
                }}
                className={`${classPrefix}-item-wrapper`}
              >
                {React.cloneElement(child, {
                  onClick: handleItemClick(child.props.onClick),
                })}
              </animated.div>
            )
          }
          return child
        })}
      </div>

      {/* Main FAB Button */}
      <animated.div
        className={`${classPrefix}-main`}
        onClick={handleMainClick}
        style={{
          transform: rotate.to(r => `rotate(${r}deg)`),
        }}
      >
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
      </animated.div>
    </div>
  )
}

// FAB.Item 컴포넌트
const FABItem: FC<FABItemProps> = p => {
  const props = mergeProps({}, p)

  return withNativeProps(
    props,
    <div
      className={`${classPrefix}-item ${props.disabled ? `${classPrefix}-item-disabled` : ''}`}
      onClick={props.disabled ? undefined : props.onClick}
    >
      {props.icon && (
        <div className={`${classPrefix}-item-icon`}>{props.icon}</div>
      )}
      {props.label && (
        <div className={`${classPrefix}-item-label`}>{props.label}</div>
      )}
    </div>
  )
}

FAB.Item = FABItem
