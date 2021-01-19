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

  const todos_ = useMemo(() => {
    return (
      <DropdownCheckboxWrapper
        setList={setList}
        title={'Todos'}
        checkbox={todos.map((i) => ({
          name: i.title,
          disabled: false,
        }))}
        isSearch={true}
      />
    )
  }, [todos])

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

  const radio_ = useMemo(() => {
    return (
      <DropdownRadioWrapper
        title={'Радио кнопки'}
        radiobox={['name 1', 'name 2']}
        setList={setList}
        isSearch={true}
      />
    )
  }, [])

  return (
    <div style={{ width: '100%', padding: 10, display: 'flex' }}>
      <Space direction={'horizontal'}>
        {/* {todos_} */}
        {posts_}
        {comments_}
        {districts_}
        {radio_}
        <Button
          id='reset'
          hidden={
            !Object.values(list).filter((arr) => arr.length > 0).length > 0
          }
        >
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
