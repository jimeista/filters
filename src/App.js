import React, { useState, useEffect } from 'react'
import oboe from 'oboe'

import { Filters } from './Components/Filters'

import 'antd/dist/antd.css'
import './App.css'

const App = () => {
  // const [data, setData] = useState([])

  // useEffect(() => {
  //   let url = 'https://sc.smartalmaty.kz/sc-air-pollution/api/averages'

  //   oboe(url).done((data_) => {
  //     setData((state) => [...state, data_])
  //     // console.log('done: ', data_)
  //   })
  // }, [])

  // console.log(data)

  return <Filters />
}

export default App
