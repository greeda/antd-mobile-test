import { FAB, Toast } from 'antd-mobile'
import { AddOutline, DeleteOutline, EditSOutline } from 'antd-mobile-icons'
import { DemoDescription } from 'demos'
import React from 'react'

export default () => {
  const handleAdd = () => {
    Toast.show('추가됨')
  }

  const handleEdit = () => {
    Toast.show('편집됨')
  }

  const handleDelete = () => {
    Toast.show('삭제됨')
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50vh 32px 0',
        minHeight: '100vh',
      }}
    >
      <DemoDescription>다른 위치의 FAB 예시 (왼쪽)</DemoDescription>
      <FAB position='left'>
        <FAB.Item icon={<AddOutline />} onClick={handleAdd} />
        <FAB.Item icon={<EditSOutline />} onClick={handleEdit} />
        <FAB.Item icon={<DeleteOutline />} onClick={handleDelete} />
      </FAB>
    </div>
  )
}
