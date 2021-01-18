import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space } from 'antd'
import axios from 'axios'

import DropdownCheckboxWrapper from '../Common/DropdownCheckboxWrapper'

export const Filters = () => {
  const [submitted, setSubmitted] = useState([])
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

  const todos_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setCount={setSubmitted}
        title={'Todos'}
        checkbox={data.map((i) => ({
          name: i.title,
          disabled: false,
          checked: false,
        }))}
        isSearch={true}
      />
    )
  }, [data])

  const posts_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setCount={setSubmitted}
        title={'Posts'}
        checkbox={posts.map((i) => ({
          name: i.title,
          disabled: false,
          checked: false,
        }))}
      />
    )
  }, [posts])

  const comments_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setCount={setSubmitted}
        title={'Comments'}
        checkbox={comments.map((i) => ({
          name: i.name,
          disabled: false,
          checked: false,
        }))}
        isSearch={true}
      />
    )
  }, [comments])

  const districts_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setCount={setSubmitted}
        title={'Районы'}
        checkbox={districts}
        isLimit={true}
        limit={3}
      />
    )
  }, [])

  return (
    <div style={{ width: '100%', padding: 10, display: 'flex' }}>
      <Space direction={'horizontal'}>
        {todos_}
        {posts_}
        {comments_}
        {districts_}
        <Button id='reset' hidden={!submitted.length > 0}>
          Сбросить
        </Button>
      </Space>
    </div>
  )
}

// дефолтные опции дропдауна
let districts = [
  { name: 'Алатауский район', disabled: false, checked: false },
  { name: 'Алмалинский район', disabled: false, checked: false },
  { name: 'Ауэзовский район', disabled: false, checked: false },
  { name: 'Бостандыкский район', disabled: false, checked: false },
  { name: 'Жетысуский район', disabled: false, checked: false },
  { name: 'Медеуский район', disabled: false, checked: false },
  { name: 'Наурызбайский район', disabled: true, checked: false },
  { name: 'Турксибский район', disabled: true, checked: false },
]
