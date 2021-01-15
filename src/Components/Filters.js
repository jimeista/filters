import React, { useEffect, useState } from 'react'
import { Button, Space } from 'antd'
import axios from 'axios'

import DropdownCheckboxWrapper from '../Common/DropdownCheckboxWrapper'

export const Filters = () => {
  const [isClear, setIsClear] = useState(false)
  const [data, setData] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((r) => setData(r.data))

    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((r) => setPosts(r.data))

    axios
      .get('https://jsonplaceholder.typicode.com/comments')
      .then((r) => setComments(r.data))
  }, [])

  console.log('loaded', isClear, posts, comments)

  return (
    <div style={{ width: '100%', padding: 10, display: 'flex' }}>
      <Space direction={'horizontal'}>
        <DropdownCheckboxWrapper
          setIsClear={setIsClear}
          title={'Todos'}
          checkbox={data.map((i) => i.title)}
        />
        <DropdownCheckboxWrapper
          setIsClear={setIsClear}
          title={'Posts'}
          checkbox={posts.map((i) => i.title)}
        />
        <DropdownCheckboxWrapper
          setIsClear={setIsClear}
          title={'Comments'}
          checkbox={comments.map((i) => i.name)}
        />
        <DropdownCheckboxWrapper
          setIsClear={setIsClear}
          title={'Районы'}
          checkbox={districts}
        />
        <Button id='reset' hidden={!isClear}>
          Сбросить
        </Button>
      </Space>
    </div>
  )
}

// дефолтные опции дропдауна
let districts = [
  'Алатауский район',
  'Алмалинский район',
  'Ауэзовский район',
  'Бостандыкский район',
  'Жетысуский район',
  'Медеуский район',
  'Наурызбайский район',
  'Турксибский район',
]
