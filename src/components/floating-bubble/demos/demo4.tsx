import { Button, FAB, Toast } from 'antd-mobile'
import {
  BellOutline,
  MailOutline,
  SetOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { DemoDescription } from 'demos'
import React, { useState } from 'react'

export default () => {
  const [expanded, setExpanded] = useState(true)

  const handleSetting = () => {
    Toast.show('설정됨')
  }

  const handleUser = () => {
    Toast.show('사용자 정보')
  }

  const handleBell = () => {
    Toast.show('알림 설정')
  }

  const handleMail = () => {
    Toast.show('메일 보내기')
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50vh 32px 0',
        minHeight: '100vh',
      }}
    >
      <DemoDescription>커스텀 스타일과 expanded 상태 예시</DemoDescription>

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={() => setExpanded(!expanded)} color='primary'>
          FAB {expanded ? '축소' : '확장'}
        </Button>
      </div>

      <FAB
        position='right'
        expanded={expanded}
        style={{
          '--background': '#ff6b6b',
          '--size': '64px',
        }}
      >
        <FAB.Item icon={<SetOutline />} onClick={handleSetting} />
        <FAB.Item icon={<UserOutline />} onClick={handleUser} />
        <FAB.Item icon={<BellOutline />} onClick={handleBell} />
        <FAB.Item icon={<MailOutline />} onClick={handleMail} />
      </FAB>
    </div>
  )
}
