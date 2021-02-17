import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Checkbox, Button, Dropdown, Input } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { List } from 'react-virtualized'
import './filters.css'
const DropdownCheckboxWrapper = ({
  handleReset = () => {},
  title = 'Наименование', //наименование фильтра
  checkbox = [], //знаячения фильтра
  setList, //состояние списка примененных фильтров
  isSearch = false, //доступность к поисковику
  isLimit = false, //лимит на отметку чекбоксов
  limit = 5, //количество доступных к отметке чекбоксов
  width = 230,
  height = 300,
  rowHeight = 30,
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
    }

    let btn = document.getElementById('reset')
    btn && btn.addEventListener('click', btnClick)

    return () =>btn && btn.removeEventListener('click', btnClick)
  }, [title, submitted, checked, setList])

  //реализация кнопки сброса фильтра
  const onReset = useCallback(() => {
    setChecked({})
    setSubmitted({})
    setFiltered()

    setList((state) => {
      delete state[title]
      return { ...state }
    })

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
    handleReset()
  }, [title, setList, handleReset])

  // useEffect(() => {
  //   console.log(checked, submitted)
  // }, [checked, submitted])

  //реализация кнопки применения фильтра
  const onSubmit = useCallback(() => {
    setSubmitted(checked)

    //отправка отмеченных значении родителю
    setList((state) => {
      let arr = Object.values(checked)
        .filter((i) => i.checked)
        .map((i) => i.value)

      let ob = { ...state }
      if (arr.length > 0) {
        ob = {
          ...state,
          [title]: arr,
        }
      } else {
        delete ob[title]
      }
      return ob
    })
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
      [value.name]: { value: value.name, checked, disabled: value.disabled },
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
          className={`Filter_Items_Style`}
        key={`${title}-${index}`}
        checked={checked[i.name] ? checked[i.name].checked : false}
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
      <div
      className={`Filter_Checkbox_Container_Style`}>
        {/* поисковик */}
        {isSearch && (
          <div style={{ margin: 5 }}>
            <Input
              onChange={onSearch}
              ref={inptRef}
              placeholder={'Поиск'}
              allowClear
              className={`Filter_Input_Item_Style`}
            />
          </div>
        )}
        {/* виртуальный список */}
        <List
            className={`Filter_List_Item_Style`}
          width={width}
          height={height}
          rowCount={list.length}
          rowHeight={rowHeight}
          rowRenderer={({ key, index, isScrolling, isVisible, style }) => (
            <div key={key} className={`Filter_List_Item_Style_inner`}>

              {/* {isScrolling ? '...' : list[index]} */}
              {list[index]}
            </div>
          )}
        />
        {/* кнопки сброса и применения */}
        <div
            className={`Filter_Btn_Style_Box`}
          key={'dropdown-btn'}

        >
          <Button
              className={`Filter_Btn_Item_Style`}
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
    height,
    rowHeight,
    width,
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
      <div className={`Dropdown_style`}>
        <Dropdown
          overlay={menu}

          trigger={['click']}
          visible={visible}
          onVisibleChange={(val) => {
            setVisible(val)
            //сброс поля поисковика
            if (inptRef && inptRef.current && inptRef.current.state) {
              setFiltered()
              inptRef.current.state.value = ''
            }
          }}

          overlayClassName={`Filter_Dropdown_Style`}
      >
        <Button
            className={`Filter_Main_Btn_Style`}

        >
          {title}
          <DownOutlined/>
        </Button>
      </Dropdown>
      </div>
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
