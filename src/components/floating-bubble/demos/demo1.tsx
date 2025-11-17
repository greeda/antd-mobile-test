import { FAB, Toast } from 'antd-mobile'
import {
  HeartOutline,
  LinkOutline,
  ReloadOutline,
  ShareOutline,
  StarOutline,
} from 'antd-mobile-icons'
import { DemoDescription } from 'demos'
import React from 'react'

export default () => {
  const handleLink = () => {
    Toast.show('링크 복사됨')
  }

  const handleShare = () => {
    Toast.show('공유됨')
  }

  const handleRefresh = () => {
    Toast.show('새로고침됨')
  }

  const handleLike = () => {
    Toast.show('좋아요!')
  }

  const handleStar = () => {
    Toast.show('즐겨찾기 추가됨')
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50vh 32px 0',
        minHeight: '100vh',
      }}
    >
      <DemoDescription>
        FAB 버튼을 클릭하여 멀티 기능을 확인해보세요
      </DemoDescription>
      <FAB position='right'>
        <FAB.Item icon={<LinkOutline />} onClick={handleLink} />
        <FAB.Item icon={<ShareOutline />} onClick={handleShare} />
        <FAB.Item icon={<ReloadOutline />} onClick={handleRefresh} />
        <FAB.Item icon={<HeartOutline />} onClick={handleLike} />
        <FAB.Item icon={<StarOutline />} onClick={handleStar} />
      </FAB>
    </div>
  )
}
