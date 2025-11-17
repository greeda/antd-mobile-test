import { FAB, Toast } from 'antd-mobile'
import { DemoDescription } from 'demos'
import React from 'react'

export default () => {
  const handleGotoTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    Toast.show('맨 위로 이동')
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50vh 32px 0',
        minHeight: '200vh', // 스크롤 테스트를 위해 높이 증가
      }}
    >
      <DemoDescription>Action 타입 FAB 예시 (gotoTop)</DemoDescription>
      <FAB type='action' onClick={handleGotoTop} />
    </div>
  )
}
