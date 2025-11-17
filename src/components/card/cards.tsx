import type { CSSProperties, FC, ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'

const classPrefix = `adm-cards`

export type CardsType = 'a' | 'b' | 'c' | 'd'

export type CardsProps = {
  type?: CardsType
  children?: ReactNode
  gap?: number | string
  onTypeChange?: (type: CardsType) => void
  /** 핀치줌 활성화 여부 */
  enablePinchZoom?: boolean
  /** 핀치줌 거리 임계값 (픽셀 단위) */
  pinchThresholds?: {
    a?: number
    b?: number
    c?: number
    d?: number
  }
} & NativeProps

const DEFAULT_PINCH_THRESHOLDS = {
  a: 50,
  b: 150,
  c: 250,
  d: 350,
}

const TYPE_COLUMNS: Record<CardsType, number> = {
  a: 1,
  b: 2,
  c: 4,
  d: 6,
}

export const Cards: FC<CardsProps> = props => {
  const {
    type: controlledType,
    children,
    gap = 12,
    onTypeChange,
    enablePinchZoom = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pinchThresholds = DEFAULT_PINCH_THRESHOLDS,
    ...rest
  } = props

  const [internalType, setInternalType] = useState<CardsType>(
    controlledType || 'a'
  )
  const [pinchScale, setPinchScale] = useState<number>(1) // 핀치줌 중 실시간 스케일
  const [isPinching, setIsPinching] = useState<boolean>(false) // 핀치줌 중인지 여부
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const touchStartDistanceRef = useRef<number | null>(null)
  const touchStartTypeRef = useRef<CardsType>(controlledType || 'a')
  const currentTypeRef = useRef<CardsType>(controlledType || 'a')
  const lastChangeTimeRef = useRef<number>(0)
  const throttleDelay = 150 // 150ms마다 최대 1번만 변경 (더 부드러운 전환)
  const previousPositionsRef = useRef<Map<number, { x: number; y: number }>>(
    new Map()
  )

  const type = controlledType ?? internalType

  // 타입 변경 핸들러
  const handleTypeChange = (newType: CardsType) => {
    if (newType !== currentTypeRef.current) {
      // 이전 위치 저장
      const previousPositions = new Map<number, { x: number; y: number }>()
      itemRefsRef.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          previousPositions.set(index, {
            x: rect.left,
            y: rect.top,
          })
        }
      })
      previousPositionsRef.current = previousPositions

      currentTypeRef.current = newType
      if (!controlledType) {
        setInternalType(newType)
      }
      onTypeChange?.(newType)

      // 다음 프레임에서 새 위치 계산 및 transform 적용
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          itemRefsRef.current.forEach((element, index) => {
            if (element) {
              const previous = previousPositions.get(index)
              if (previous) {
                const currentRect = element.getBoundingClientRect()
                const deltaX = previous.x - currentRect.left
                const deltaY = previous.y - currentRect.top

                if (deltaX !== 0 || deltaY !== 0) {
                  // FLIP: First, Last, Invert, Play
                  element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
                  element.style.transition = 'none'

                  // 다음 프레임에서 transform 제거하여 자연스러운 이동
                  requestAnimationFrame(() => {
                    element.style.transition = ''
                    element.style.transform = ''
                  })
                }
              }
            }
          })
        })
      })
    }
  }

  // 두 터치 포인트 사이의 거리 계산
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // 스케일 비율에 따라 타입 결정 (더 넓은 구간으로 부드러운 전환)
  const getTypeFromScale = (scale: number): CardsType => {
    // 스케일이 1보다 작으면 축소, 크면 확대
    // 축소: a -> b -> c -> d (더 많은 열)
    // 확대: d -> c -> b -> a (더 적은 열)

    const typeOrder: CardsType[] = ['a', 'b', 'c', 'd']
    const currentIndex = typeOrder.indexOf(touchStartTypeRef.current)

    // 더 넓은 구간으로 조정하여 제스처가 확 지나가지 않도록
    // 단계별로 1단계씩만 변경하여 자연스러운 전환
    let newIndex = currentIndex

    if (scale < 0.6) {
      // 강한 축소: 1단계씩 증가 (더 많은 열)
      newIndex = Math.min(typeOrder.length - 1, currentIndex + 1)
    } else if (scale < 0.85) {
      // 약간 축소: 유지하거나 1단계 증가
      if (currentIndex < typeOrder.length - 1) {
        newIndex = currentIndex + 1
      } else {
        newIndex = currentIndex
      }
    } else if (scale < 1.15) {
      // 거의 변화 없음: 유지 (더 넓은 구간)
      newIndex = currentIndex
    } else if (scale < 1.4) {
      // 약간 확대: 유지하거나 1단계 감소
      if (currentIndex > 0) {
        newIndex = currentIndex - 1
      } else {
        newIndex = currentIndex
      }
    } else {
      // 강한 확대: 1단계씩 감소 (더 적은 열)
      newIndex = Math.max(0, currentIndex - 1)
    }

    return typeOrder[newIndex]
  }

  useEffect(() => {
    if (!enablePinchZoom || !containerRef.current) return

    const container = containerRef.current

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // 두 손가락 터치 감지 시 브라우저 기본 핀치줌 방지
        e.preventDefault()
        touchStartDistanceRef.current = getTouchDistance(e.touches)
        touchStartTypeRef.current = type
        setPinchScale(1) // 스케일 초기화
        setIsPinching(true) // 핀치줌 시작
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistanceRef.current !== null) {
        // 두 손가락 터치 중일 때 브라우저 기본 핀치줌 방지
        e.preventDefault()

        const currentDistance = getTouchDistance(e.touches)
        const scale = currentDistance / touchStartDistanceRef.current

        // 타입별 스케일 제한 적용
        let clampedScale = scale

        // 1단(a)에서 확대 제스처: 이미 최대 크기이므로 확대 불가
        if (type === 'a' && scale > 1) {
          clampedScale = 1
        }
        // 8단(d)에서 축소 제스처: 이미 최소 크기이므로 축소 불가
        else if (type === 'd' && scale < 1) {
          clampedScale = 1
        }
        // 그 외: 0.6 ~ 1.4 범위로 제한 (임계값과 일치)
        else {
          clampedScale = Math.max(0.6, Math.min(1.4, scale))
        }

        setPinchScale(clampedScale)

        // 스로틀링: 너무 자주 변경되지 않도록
        const now = Date.now()
        if (now - lastChangeTimeRef.current >= throttleDelay) {
          // 스케일 비율에 따라 타입 결정
          const newType = getTypeFromScale(scale)
          if (newType !== currentTypeRef.current) {
            lastChangeTimeRef.current = now
            handleTypeChange(newType)
            // 레이아웃 변경 시 스케일 리셋
            setPinchScale(1)
          }
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // 두 손가락 터치가 끝날 때도 기본 동작 방지
      if (e.touches.length === 0 || e.touches.length === 1) {
        touchStartDistanceRef.current = null
        setIsPinching(false) // 핀치줌 종료
        // 핀치줌 종료 시 스케일을 부드럽게 1로 복원
        setPinchScale(1)
      }
    }

    // passive: false로 설정하여 preventDefault() 사용 가능
    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })
    container.addEventListener('touchcancel', handleTouchEnd, {
      passive: false,
    })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [enablePinchZoom, type])

  const columns = TYPE_COLUMNS[type]
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap

  const style: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapValue,
    ...rest.style,
  }

  return withNativeProps(
    rest,
    <div ref={containerRef} className={classPrefix} style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <div
              key={`${type}-${index}`}
              ref={el => {
                if (el) {
                  itemRefsRef.current.set(index, el)
                } else {
                  itemRefsRef.current.delete(index)
                }
              }}
              className={`${classPrefix}-item`}
              style={{
                transform: `scale(${pinchScale})`,
                transition: isPinching
                  ? 'none'
                  : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {child}
            </div>
          )
        }
        return child
      })}
    </div>
  )
}
