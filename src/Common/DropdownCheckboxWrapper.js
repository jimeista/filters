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
        setCount([])
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
  }, [title, setCount, submitted, checked])

  //реализация кнопки сброса фильтра
  const onReset = useCallback(() => {
    setChecked({})
    setSubmitted({})
    setCount((state) => state.filter((i) => i !== title)) //сбрасываем значение этого фильтра
    setVisible(false)
    setFiltered()

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [setCount, title])

  //реализация кнопки применения фильтра
  const onSubmit = useCallback(() => {
    setSubmitted(checked)
    //добавляем значение этого фильтра в родительсоке состояние
    //или убираем значения если хотим авторучно сбросить отмеченные значения
    Object.values(checked).filter((i) => i.checked).length > 0
      ? setCount((state) => [...state, title])
      : setCount((state) => state.filter((name) => name !== title))
    setVisible(false)
    setFiltered()

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [checked, setCount, title])

  //реализация изменения чекбокса
  const onChange = useCallback(
    (checked, value, index) =>
      setChecked((state) => ({
        ...state,
        [index]: { value: value.name, checked, disabled: value.disabled },
      })),
    []
  )

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

    list = list.sort((a, b) => b.props.checked - a.props.checked)
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
