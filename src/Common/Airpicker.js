import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import 'air-datepicker/dist/js/datepicker.js'
import 'air-datepicker/dist/css/datepicker.css'

import './Airpicker.css'

const AirDatepicker = ({ date, setDate }) => {
  const [state, setState] = useState('')
  useEffect(() => {
    $('#example-show').datepicker({
      language: 'ru',
      onSelect: (formattedDate) => {
        setState(formattedDate)
      },
    })

    let el = $('#example-show').data('datepicker').$el[0]
    if (date === '') {
      setState('')
      el.value = ''
    }
  }, [date])

  const handleOff = () => {
    setDate(state)
  }

  return (
    <div
      className={'airpicker-container'}
      style={{ display: 'flex', padding: 5 }}
    >
      <input
        id='example-show'
        type='text'
        data-range='true'
        data-multiple-dates-separator=' - '
        className='datepicker-here'
        placeholder='выбрать диапазон'
        autoComplete='off'
        style={{ minWidth: 190 }}
      />
      <button
        className='calendar_ok covid_city_btn'
        onClick={handleOff}
        disabled={!state.length > 0}
      >
        ок
      </button>
    </div>
  )
}

export default React.memo(AirDatepicker)
