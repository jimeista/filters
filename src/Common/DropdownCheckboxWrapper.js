import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Checkbox, Button, Dropdown, Input } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { List } from 'react-virtualized'

const DropdownCheckboxWrapper = ({
  title = 'Наименование', //наименование фильтра
  checkbox = [], //знаячения фильтра, формат ['name1','name2',..]
  setCount, //состояние кнопки сброса всех фильтров, bool
  isSearch = false, //доступность к поисковику
}) => {
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [filtered, setFiltered] = useState()
  const inptRef = useRef(null)

  useEffect(() => {
    const btnClick = () => {
      if (Object.keys(submitted).length > 0) {
        setSubmitted({})
        setCount([])
        setFiltered()
      }

      if (Object.keys(checked).length > 0) {
        setChecked({})
      }
      if (inptRef && inptRef.current) {
        inptRef.current.state.value = ''
      }
    }

    let btn = document.getElementById('reset')

    btn.addEventListener('click', btnClick)

    return () => btn.removeEventListener('click', btnClick)
  }, [title, setCount, submitted, checked])

  const onReset = useCallback(() => {
    setChecked({})
    setSubmitted({})
    setCount((state) => state.filter((i) => i !== title))
    setVisible(false)
    setFiltered()

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [setCount, title])

  const onSubmit = useCallback(() => {
    setSubmitted(checked)
    setCount((state) => [...state, title])
    setVisible(false)
    setFiltered()

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [checked, setCount, title])

  const onChange = useCallback(
    (checked, value, index) =>
      setChecked((state) => ({ ...state, [index]: { value, checked } })),
    []
  )

  const onSearch = useCallback(
    (e) => {
      setFiltered(checkbox.filter((i) => i.includes(e.target.value)))
    },
    [checkbox]
  )

  const menu = useMemo(() => {
    let data = filtered ? filtered : checkbox
    const list = data.map((value, index) => (
      <Checkbox
        key={`${title}-${index}`}
        checked={checked[index] ? checked[index].checked : false}
        onChange={(e) => onChange(e.target.checked, value, index)}
        style={{ margin: 5 }}
      >
        {value.slice(0, 25)}
      </Checkbox>
    ))
    return (
      <div style={{ backgroundColor: '#fff', paddingTop: 5 }}>
        {isSearch && (
          <div style={{ margin: 5 }}>
            <Input onChange={onSearch} ref={inptRef} />
          </div>
        )}
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
  }, [
    title,
    isSearch,
    checkbox,
    filtered,
    checked,
    submitted,
    onSearch,
    onChange,
    onReset,
    onSubmit,
  ])

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
