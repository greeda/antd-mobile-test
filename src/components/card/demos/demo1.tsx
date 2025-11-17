import { Button, Card, Cards, Toast } from 'antd-mobile'
import { AntOutline, RightOutline } from 'antd-mobile-icons'
import { DemoBlock } from 'demos'
import React, { useState } from 'react'

import styles from './demo1.less'

export default () => {
  const onClick = () => {
    Toast.show('点击了卡片')
  }

  const onHeaderClick = () => {
    Toast.show('点击了卡片Header区域')
  }

  const onBodyClick = () => {
    Toast.show('点击了卡片Body区域')
  }
  return (
    <>
      <DemoBlock title='基础用法' background='gray'>
        <Card title='卡片标题' onClick={onClick}>
          卡片内容
        </Card>
      </DemoBlock>

      <DemoBlock title='没有卡片内容' background='gray'>
        <Card title='卡片标题' onClick={onClick} />
      </DemoBlock>

      <DemoBlock title='没有卡片标题' background='gray'>
        <Card onClick={onClick}>卡片内容</Card>
      </DemoBlock>

      <DemoBlock title='自定义卡片内容' background='gray'>
        <Card
          icon={<AntOutline style={{ color: '#1677ff' }} />}
          title={<div style={{ fontWeight: 'normal' }}>卡片标题</div>}
          extra={<RightOutline />}
          onBodyClick={onBodyClick}
          onHeaderClick={onHeaderClick}
          style={{ borderRadius: '16px' }}
        >
          <div className={styles.content}>卡片内容</div>
          <div className={styles.footer} onClick={e => e.stopPropagation()}>
            <Button
              color='primary'
              onClick={() => {
                Toast.show('点击了底部按钮')
              }}
            >
              底部按钮
            </Button>
          </div>
        </Card>
      </DemoBlock>

      <DemoBlock title='自定义卡片样式' background='gray'>
        <Card
          headerStyle={{
            color: '#1677ff',
          }}
          bodyClassName={styles.customBody}
          title='卡片标题'
        >
          卡片内容
        </Card>
      </DemoBlock>

      <DemoBlock title='Cards 网格布局' background='gray'>
        <CardsDemo />
      </DemoBlock>
    </>
  )
}

const CardsDemo = () => {
  const [currentType, setCurrentType] = useState<'a' | 'b' | 'c' | 'd'>('a')
  const typeLabels = {
    a: '1단 (1열)',
    b: '2단 (2열)',
    c: '4단 (4열)',
    d: '6단 (6열)',
  }

  const handleTypeChange = (type: 'a' | 'b' | 'c' | 'd') => {
    setCurrentType(type)
    Toast.show(`레이아웃 변경: ${typeLabels[type]}`)
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          padding: 8,
          background: 'var(--adm-color-background)',
          borderRadius: 8,
          fontSize: 14,
          color: 'var(--adm-color-text)',
        }}
      >
        현재 레이아웃: <strong>{typeLabels[currentType]}</strong>
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
          모바일에서 두 손가락으로 핀치/줌하여 레이아웃을 변경할 수 있습니다.
        </div>
      </div>
      <Cards
        type={currentType}
        gap={12}
        onTypeChange={handleTypeChange}
        enablePinchZoom={true}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const number = i + 1
          const koreanNumbers = [
            '첫',
            '두',
            '세',
            '네',
            '다섯',
            '여섯',
            '일곱',
            '여덟',
            '아홉',
            '열',
            '열한',
            '열두',
            '열세',
            '열네',
            '열다섯',
            '열여섯',
            '열일곱',
            '열여덟',
            '열아홉',
            '스무',
          ]
          return (
            <Card key={number} title={`카드 ${number}`}>
              {koreanNumbers[i]} 번째 카드 내용입니다.
            </Card>
          )
        })}
      </Cards>
    </div>
  )
}
