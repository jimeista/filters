import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space } from 'antd'
import axios from 'axios'

import DropdownCheckboxWrapper from '../Common/DropdownCheckboxWrapper'
import DropdownRadioWrapper from '../Common/DropdownRadioWrapper'
import DropdownPeriodWrapper from '../Common/DropdownPeriodWrapper'

export const Filters = () => {
  //состояние значении примененных фильтров
  const [list, setList] = useState({})
  // данные чекбоксов фильтра
  const [todos, setTodos] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  console.log(list)

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
        handleReset={() => {}}
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
        handleReset={() => {}}
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
        handleReset={() => {}}
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
        handleReset={() => {}}
      />
    )
  }, [todos])

  return (
    <div style={{ width: '100%', padding: 10, display: 'flex' }}>
      <Space direction={'horizontal'}>
        <DropdownPeriodWrapper setList={setList} slider={true} />
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
  { name: 'Алатауский район', disabled: false },
  { name: 'Алмалинский район', disabled: false },
  { name: 'Ауэзовский район', disabled: false },
  { name: 'Бостандыкский район', disabled: false },
  { name: 'Жетысуский район', disabled: false },
  { name: 'Медеуский район', disabled: false },
  { name: 'Наурызбайский район', disabled: true },
  { name: 'Турксибский район', disabled: true },
]
