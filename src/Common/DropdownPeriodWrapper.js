import React, { useEffect, useMemo, useCallback, useState } from 'react'
import {Button, Checkbox, Dropdown, Slider} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import './filters.css'
import Airpicker from './Airpicker'

const DropdownPeriodWrapper = ({
  title = 'Период', //наименование фильтра
  setList, //состояние списка примененных фильтров
  slider = false,
  handleReset = () => {},
}) => {
  const [visible, setVisible] = useState(false) //состояние dropdown открыто закрыто
  const [date, setDate] = useState('')
  const [time, setTime] = useState([0, 24])

  useEffect(() => {
    const btnClick = () => {
      setList((state) => (Object.values(state).length > 0 ? {} : state))
      setDate('')
      setTime([])
    }

    let btn = document.getElementById('reset')

    btn && btn.addEventListener('click', btnClick)

    return () => {
      btn && btn.removeEventListener('click', btnClick)
    }
  }, [setList])

  useEffect(() => {
    const close = (e) => {
      // console.log(e.target)
      let noRedirect =
        '.Filter_Main_Btn_Style > span,' +
          '.airpicker-container,' +
          '.dropdown-menu-innerdiv,' +
          '.dropdown-menu-p,' +
          '.dropdown-menu-h3,' +
          '.ant-slider-handle,' +
          '.ant-slider-handle-click-focused,' +
          '.ant-slider-handle-2, ' +
          '.dropdown-btn,' +
          '.ant-slider ' +
          '.ant-slider-track .ant-slider-track-1,' +
          '.ant-slider-rail,' +
          '.ant-slider-with-marks, ' +
          '.dropdown-menu-custom, ' +
          '.ant-btn, ' +
          '.covid_city_btn, ' +
          '.ant_drop_block_text, ' +
          '.ant-dropdown-menu-item-only-child, ' +
          '.ant_drop_menu_air_datepicker, ' +
          '.datepicker-here, ' +
          '.datepicker--content, ' +
          '.datepicker--cell, ' +
          '.datepicker--nav, ' +
          '.datepicker--nav-title, ' +
          '.datepickers-container,' +
          '.datepicker,svg'
      if (!e.target.matches(noRedirect)) {
        setVisible(false)
      }
    }

    document.body.addEventListener('click', close)

    return () => document.body.removeEventListener('click', close)
  }, [])

  //реализация кнопки сброса фильтра
  const onReset = useCallback(() => {
    setDate('')
    setList((state) => {
      delete state[title]
      return { ...state }
    })
    setTime([])
    handleReset()
  }, [setList, title, handleReset])

  //реализация кнопки применения фильтра
  const onSubmit = useCallback(() => {
    setList((state) => ({ ...state, [title]: { date, time } }))
    setVisible(false)
  }, [setList, title, date, time])

  //реализация изменения ползунка
  const onChange = useCallback((value) => {
    setTime(value)
  }, [])

  // меню дропдауна
  const menu = useMemo(() => {
    return (
      <div  className={`Filter_Items_Style period_style`} >
        <Airpicker date={date} setDate={setDate} />
        {slider && (<div className={'dropdown-menu-innerdiv'} >
            <span className='dropdown-menu-h3 Filter_Period_Time_title'>Время </span>
            {date ? (
              <Slider
                range
                marks={marks}
                min={0}
                max={24}
                defaultValue={[0, 24]}
                onChange={onChange}

              />
            ) : (
              <span className='dropdown-menu-p Filter_Period_Time_text'>Выберите промежуток времени</span>
            )}
          </div>
        )}
        {/* кнопки сброса и применения */}
        <div
            className={`Filter_Btn_Style_Box`}
          key={'dropdown-btn'}

        >
          <Button className={`Filter_Btn_Item_Style`} type='primary' onClick={onReset} hidden={!date.length > 0}>
            Сбросить
          </Button>
          <Button className={`Filter_Btn_Item_Style`} type='primary' onClick={onSubmit} hidden={!date.length > 0}>
            Применить
          </Button>
        </div>
      </div>
    )
  }, [date, slider, setDate, onReset, onSubmit, onChange])

  return (
      <div className={`Dropdown_style`}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          visible={visible}
          onClick={() => setVisible((state) => !state)}
          // onVisibleChange={() => setVisible((state) => !state)}
          overlayClassName={`Filter_Dropdown_Style`}
      >
        <Button
            className={`Filter_Main_Btn_Style`}
        >
          {title}
          <DownOutlined/>
        </Button>
      </Dropdown></div>
  )
}

export default React.memo(DropdownPeriodWrapper)

const marks = {
  0: '00:00',
  6: '06:00',
  12: '12:00',
  18: '18:00',
  24: '24:00',
}
