import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Checkbox, Button, Dropdown, Input } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { List } from 'react-virtualized'

const DropdownCheckboxWrapper = ({
  title = 'Наименование', //наименование фильтра
  checkbox = [], //знаячения фильтра, формат ['name1','name2',..]
  setList, //состояние списка примененных фильтров
  isSearch = false, //доступность к поисковику
  isLimit = false, //лимит на отметку чекбоксов
  limit = 5, //количество доступных к отметке чекбоксов
}) => {
  const [visible, setVisible] = useState(false) //состояние dropdown открыто закрыто
  const [checked, setChecked] = useState({}) //состояние чекбоксов при onChange методе
  const [submitted, setSubmitted] = useState({}) //состояние сохраненых чекбоксов
  const [filtered, setFiltered] = useState() //состояние фильтрованных чекбоксов при поисковике
  const inptRef = useRef(null) //ссылка к dom элементу поисковика

  useEffect(() => {
    const btnClick = () => {
      //сброс сохраненных значении чекбоксов
      if (Object.keys(submitted).length > 0) {
        setSubmitted({})
        setList((state) => (Object.values(state).length > 0 ? {} : state))
        setFiltered()
      }

      //сброс отмеченных,но не сохраненных значении чекбоксов
      if (Object.keys(checked).length > 0) {
        setChecked({})
      }
      //сброс поля поисковика
      if (inptRef && inptRef.current) {
        inptRef.current.state.value = ''
      }
    }

    let btn = document.getElementById('reset')
    btn.addEventListener('click', btnClick)

    return () => btn.removeEventListener('click', btnClick)
  }, [title, submitted, checked, setList])

  //реализация кнопки сброса фильтра
  const onReset = useCallback(() => {
    setChecked({})
    setSubmitted({})
    setVisible(false)
    setFiltered()

    setList((state) => ({ ...state, [title]: [] }))

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [title, setList])

  //реализация кнопки применения фильтра
  const onSubmit = useCallback(() => {
    setSubmitted(checked)

    //отправка отмеченных значении родителю
    setList((state) => ({
      ...state,
      [title]: Object.values(checked)
        .filter((i) => i.checked)
        .map((i) => i.value),
    }))
    setVisible(false)
    setFiltered()

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [checked, title, setList])

  //реализация изменения чекбокса
  const onChange = useCallback((checked, value, index) => {
    setChecked((state) => ({
      ...state,
      [index]: { value: value.name, checked, disabled: value.disabled },
    }))
  }, [])

  //реализация поисковика
  const onSearch = useCallback(
    (e) => {
      setFiltered(checkbox.filter((i) => i.name.includes(e.target.value)))
    },
    [checkbox]
  )

  // меню дропдауна
  const menu = useMemo(() => {
    let data = filtered ? filtered : checkbox
    // список чекбоксов
    let list = data.map((i, index) => (
      <Checkbox
        key={`${title}-${index}`}
        checked={checked[index] ? checked[index].checked : false}
        onChange={(e) => onChange(e.target.checked, i, index)}
        style={{ margin: 5 }}
        disabled={i.disabled}
      >
        {i.name.slice(0, 25)}
      </Checkbox>
    ))

    //моментальная сортировка отмеченных значении чекбокса
    list =
      list.length > 10
        ? list.sort((a, b) => b.props.checked - a.props.checked)
        : list

    // проверка на лимит отметки чекбоксов
    list = isLimit ? limitCheckbox(list, limit) : list

    return (
      <div style={{ backgroundColor: '#fff', paddingTop: 5 }}>
        {/* поисковик */}
        {isSearch && (
          <div style={{ margin: 5 }}>
            <Input
              onChange={onSearch}
              ref={inptRef}
              placeholder={'Поиск'}
              allowClear
            />
          </div>
        )}
        {/* виртуальный список */}
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
        {/* кнопки сброса и применения */}
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
            hidden={
              Object.values(checked).filter((i) => i.checked).length === 0 &&
              Object.values(submitted).filter((i) => i.checked).length === 0
            }
          >
            Сбросить
          </Button>
          <Button
            type='primary'
            onClick={onSubmit}
            hidden={
              // Object.values(checked).filter((i) => i.checked).length === 0 ||
              Object.values(submitted).filter((i) => i.checked).length === 0 &&
              Object.values(checked).filter((i) => i.checked).length === 0
            }
          >
            Применить
          </Button>
        </div>
      </div>
    )
  }, [
    title,
    isSearch,
    isLimit,
    limit,
    checkbox,
    submitted,
    filtered,
    checked,
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

const limitCheckbox = (data, limit) => {
  let count = data.filter((i) => i.props.checked).length

  if (count === limit) {
    return data.map((i) => ({
      ...i,
      props: { ...i.props, disabled: i.props.checked ? false : true },
    }))
  } else {
    return data
  }
}
