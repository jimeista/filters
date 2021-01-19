import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space } from 'antd'
import axios from 'axios'

import DropdownCheckboxWrapper from '../Common/DropdownCheckboxWrapper'
import DropdownRadioWrapper from '../Common/DropdownRadioWrapper'

export const Filters = () => {
  //состояние значении примененных фильтров
  const [list, setList] = useState({})
  // данные чекбоксов фильтра
  const [todos, setTodos] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((r) => setTodos(r.data))

    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((r) => setPosts(r.data))

    axios
      .get('https://jsonplaceholder.typicode.com/comments')
      .then((r) => setComments(r.data))
  }, [])

  const posts_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setList={setList}
        title={'Posts'}
        checkbox={posts.map((i) => ({
          name: i.title,
          disabled: false,
        }))}
      />
    )
  }, [posts])

  const comments_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setList={setList}
        title={'Comments'}
        checkbox={comments.map((i) => ({
          name: i.name,
          disabled: false,
        }))}
        isSearch={true}
      />
    )
  }, [comments])

  const districts_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        title={'Районы'}
        checkbox={districts}
        setList={setList}
        isLimit={true}
        limit={3}
      />
    )
  }, [])

  const todos_ = useMemo(() => {
    return (
      <DropdownRadioWrapper
        title={'Радио кнопки Todos'}
        radiobox={todos.map((i) => ({ name: i.title, disabled: false }))}
        setList={setList}
        isSearch={true}
      />
    )
  }, [todos])

  return (
    <div style={{ width: '100%', padding: 10, display: 'flex' }}>
      <Space direction={'horizontal'}>
        {posts_}
        {comments_}
        {districts_}
        {todos_}
        <Button id='reset' hidden={!Object.values(list).length > 0}>
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
