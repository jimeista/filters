import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Checkbox, Button, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { List } from 'react-virtualized'

const DropdownCheckboxWrapper = ({
  title = 'Наименование', //наименование фильтра
  checkbox = [], //знаячения фильтра, формат ['name1','name2',..]
  setIsClear, //состояние кнопки сброса всех фильтров
}) => {
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState({})
  const [submitted, setSubmitted] = useState({})

  useEffect(() => {
    const btnClick = () => {
      setChecked({})
      setSubmitted({})
      setIsClear(false)
    }

    if (Object.keys(submitted).length > 0) {
      setIsClear(true)
    }

    let btn = document.getElementById('reset')

    btn.addEventListener('click', btnClick)

    return () => btn.removeEventListener('click', btnClick)
  }, [title, setIsClear, submitted])

  const onReset = useCallback(() => {
    setChecked({})
    setSubmitted({})
    setVisible(false)
  }, [])

  const onSubmit = useCallback(() => {
    setSubmitted(checked)
    setVisible(false)
  }, [checked])

  const onChange = useCallback(
    (value, index) => setChecked((state) => ({ ...state, [index]: value })),
    []
  )

  const menu = useMemo(() => {
    const list = checkbox.map((d, index) => (
      <Checkbox
        key={`${title}-${index}`}
        checked={checked[index] ? true : false}
        onChange={(e) => onChange(e.target.checked, index)}
        style={{ margin: 5 }}
      >
        {d.slice(0, 25)}
      </Checkbox>
    ))
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <List
          width={230}
          height={300}
          rowCount={list.length}
          rowHeight={30}
          rowRenderer={({ key, index, isScrolling, isVisible, style }) => (
            <div key={key} style={style}>
              {/* {isScrolling ? '...' : list[index]} */}
              {list[index]}
            </div>
          )}
        />
        <div
          key={'dropdown-btn'}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 5,
          }}
        >
          <Button
            type='primary'
            onClick={onReset}
            hidden={Object.keys(submitted).length === 0}
          >
            Сбросить
          </Button>
          <Button
            type='primary'
            onClick={onSubmit}
            hidden={Object.keys(checked).length === 0}
          >
            Применить
          </Button>
        </div>
      </div>
    )
  }, [title, checkbox, checked, submitted, onChange, onReset, onSubmit])

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={(val) => {
        setVisible(val)
      }}
      className='ant_drop_menu'
    >
      <Button className='ant_drop_btn'>
        {title}
        <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default React.memo(DropdownCheckboxWrapper)
