import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Button, Dropdown, Input, Radio } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { List } from 'react-virtualized'

const DropdownRadioWrapper = ({
  title = 'Наименование', //наименование фильтра
  radiobox = [], //знаячения фильтра
  isSearch = false, //доступность к поисковику
  setList, //состояние списка примененных фильтров
}) => {
  const [visible, setVisible] = useState(false) //состояние dropdown открыто закрыто
  const [filtered, setFiltered] = useState() //состояние фильтрованных радио кнопок при поисковике
  const [checked, setChecked] = useState(null) //состояние радио кнопки при onChange методе
  const inptRef = useRef(null) //ссылка к dom элементу поисковика

  useEffect(() => {
    const btnClick = () => {
      //сброс отмеченных,но не сохраненных значении радио кнопок
      if (checked) {
        setList((state) => ({ ...state, [title]: [] }))
        setChecked(null)
      }
    }

    let btn = document.getElementById('reset')
    btn.addEventListener('click', btnClick)

    return () => btn.removeEventListener('click', btnClick)
  }, [title, checked, setList])

  //реализация кнопки сброса фильтра
  const onReset = useCallback(() => {
    setVisible(false)
    setFiltered()
    setChecked(null)

    setList((state) => ({ ...state, [title]: [] }))

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [setList, title])

  //реализация кнопки применения фильтра
  const onSubmit = useCallback(() => {
    setVisible(false)
    setFiltered()
    //отправка отмеченных значении родителю
    setList((state) => ({ ...state, [title]: checked }))

    if (inptRef && inptRef.current) {
      inptRef.current.state.value = ''
    }
  }, [checked, title, setList])

  //реализация изменения радио кнопок
  const onChange = useCallback((e) => {
    setChecked(e.target.value)
  }, [])

  //реализация поисковика
  const onSearch = useCallback(
    (e) => {
      setFiltered(radiobox.filter((value) => value.includes(e.target.value)))
    },
    [radiobox]
  )
  // меню дропдауна
  const menu = useMemo(() => {
    let data = filtered ? filtered : radiobox

    // список радио кнопок
    let list = data.map((value) => (
      <Radio value={value} key={value}>
        {value}
      </Radio>
    ))

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
            <Radio.Group
              name={'radiogroup'}
              value={checked}
              onChange={onChange}
              key={key}
              style={{ display: 'flex', padding: 5 }}
            >
              {list[index]}
            </Radio.Group>
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
            hidden={checked ? false : true}
          >
            Сбросить
          </Button>
          <Button
            type='primary'
            onClick={onSubmit}
            hidden={checked ? false : true}
          >
            Применить
          </Button>
        </div>
      </div>
    )
  }, [
    isSearch,
    radiobox,
    filtered,
    onChange,
    onSearch,
    onReset,
    onSubmit,
    checked,
  ])

  return (
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
      className='ant_drop_menu'
    >
      <Button className='ant_drop_btn'>
        {title}
        <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default React.memo(DropdownRadioWrapper)
