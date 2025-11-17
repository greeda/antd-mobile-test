import {
  FilterOutlined,
  PushpinOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from 'antd'
import React, { useState } from 'react'

const { Search } = Input
const { Text } = Typography

interface CustomFilterProps {
  params: any
  onFilterChange: (filterModel: any) => void
}

interface FilterOption {
  label: string
  value: string
  checked: boolean
}

const CustomFilter: React.FC<CustomFilterProps> = ({
  params,
  onFilterChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  )
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { label: '옵션 1', value: 'option1', checked: false },
    { label: '옵션 2', value: 'option2', checked: false },
    { label: '옵션 3', value: 'option3', checked: false },
    { label: '옵션 4', value: 'option4', checked: false },
  ])

  // 정렬 기능
  const handleSort = (direction: 'asc' | 'desc') => {
    setSortDirection(direction)
    params.api.setSortModel([
      {
        colId: params.column.getColId(),
        sort: direction,
      },
    ])
  }

  const clearSort = () => {
    setSortDirection(null)
    params.api.setSortModel([])
  }

  // Pin 기능
  const handlePinLeft = () => {
    params.api.setColumnPinned(params.column, 'left')
  }

  const handlePinRight = () => {
    params.api.setColumnPinned(params.column, 'right')
  }

  const handleUnpin = () => {
    params.api.setColumnPinned(params.column, null)
  }

  // 검색 기능
  const handleSearch = (value: string) => {
    setSearchValue(value)
    // 검색 로직 구현
    const filterModel = {
      [params.column.getColId()]: {
        filterType: 'text',
        type: 'contains',
        filter: value,
      },
    }
    params.api.setFilterModel(filterModel)
  }

  // 체크박스 필터 기능
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newOptions = filterOptions.map(option =>
      option.value === value ? { ...option, checked } : option
    )
    setFilterOptions(newOptions)

    // 체크된 옵션들로 필터 적용
    const checkedValues = newOptions
      .filter(option => option.checked)
      .map(option => option.value)

    const filterModel = {
      [params.column.getColId()]: {
        filterType: 'set',
        values: checkedValues,
      },
    }
    params.api.setFilterModel(filterModel)
  }

  // 필터 초기화
  const handleClear = () => {
    setSearchValue('')
    setSortDirection(null)
    setFilterOptions(prev =>
      prev.map(option => ({ ...option, checked: false }))
    )
    params.api.setFilterModel({})
    params.api.setSortModel([])
  }

  return (
    <Card
      size='small'
      style={{ width: 300, maxHeight: 400, overflow: 'auto' }}
      title={
        <Space>
          <FilterOutlined />
          <Text strong>{params.column.getColDef().headerName} 필터</Text>
        </Space>
      }
    >
      {/* 정렬 섹션 */}
      <div style={{ marginBottom: 12 }}>
        <Text strong>정렬</Text>
        <Row gutter={8} style={{ marginTop: 4 }}>
          <Col>
            <Button
              size='small'
              type={sortDirection === 'asc' ? 'primary' : 'default'}
              icon={<SortAscendingOutlined />}
              onClick={() => handleSort('asc')}
            >
              오름차순
            </Button>
          </Col>
          <Col>
            <Button
              size='small'
              type={sortDirection === 'desc' ? 'primary' : 'default'}
              icon={<SortDescendingOutlined />}
              onClick={() => handleSort('desc')}
            >
              내림차순
            </Button>
          </Col>
          {sortDirection && (
            <Col>
              <Button size='small' onClick={clearSort}>
                정렬 해제
              </Button>
            </Col>
          )}
        </Row>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Pin 섹션 */}
      <div style={{ marginBottom: 12 }}>
        <Text strong>Pin</Text>
        <Row gutter={4} style={{ marginTop: 4 }}>
          <Col>
            <Button
              size='small'
              icon={<PushpinOutlined />}
              onClick={handlePinLeft}
            >
              Pin Left
            </Button>
          </Col>
          <Col>
            <Button
              size='small'
              icon={<PushpinOutlined />}
              onClick={handlePinRight}
            >
              Pin Right
            </Button>
          </Col>
          <Col>
            <Button size='small' onClick={handleUnpin}>
              Unpin
            </Button>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 검색 섹션 */}
      <div style={{ marginBottom: 12 }}>
        <Text strong>검색</Text>
        <Search
          placeholder='검색어 입력'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          size='small'
          style={{ marginTop: 4 }}
        />
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 체크박스 필터 섹션 */}
      <div style={{ marginBottom: 12 }}>
        <Text strong>필터 옵션</Text>
        <div style={{ marginTop: 4, maxHeight: 120, overflow: 'auto' }}>
          {filterOptions.map(option => (
            <div key={option.value} style={{ marginBottom: 4 }}>
              <Checkbox
                checked={option.checked}
                onChange={e =>
                  handleCheckboxChange(option.value, e.target.checked)
                }
              >
                {option.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 액션 버튼들 */}
      <Row gutter={8}>
        <Col>
          <Button size='small' onClick={handleClear}>
            초기화
          </Button>
        </Col>
        <Col>
          <Button
            size='small'
            type='primary'
            onClick={() => {
              // 필터 적용 로직
              onFilterChange({})
            }}
          >
            적용
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CustomFilter


