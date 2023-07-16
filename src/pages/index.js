import React, { useEffect, useState } from "react";
import client from "./apollo-client/client";
import { gql, useMutation } from "@apollo/client"

const Todo = (data) =>  {
  // console.log(data.data.getList)
  const [name, setName] = useState('');
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState(data.data.getList);

  let socket = null

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleTodoChange = (event) => {
    setTodo(event.target.value)
  }

  const ADD_TODO_MUTATION = gql `
    mutation ($name: String!, $todo: String!) {
      addTodo(name: $name, todo: $todo) {
        id
        name
        todo
      }
    }
  `;

  // const [addPost, { loading, error }] = useMutation(ADD_TODO_MUTATION)

  const addToList = async() => {
    try {
      // const res = await addPost({
      //   variables: {name: name, todo: todo}
      // })
      const res = await client.mutate({
        mutation: ADD_TODO_MUTATION,
        variables: {name: name, todo: todo}
      })
      setName('');
      setTodo('');
    } catch (error) {
      console.log(error)
    }
  return
  }
  
  useEffect(()=>{
    socket = new WebSocket('ws://192.168.0.112:7000')
    socket.onopen = () => {
      console.log('WebSocket Connection')
    }
    socket.onmessage = (event) => {
      console.log(event.data)
      setTodos((prevTodos) => [...prevTodos, JSON.parse(event.data)])
    }
    return () => socket.close()
  },[])

  return (
    <div className='items-center justify-between flex m-8'>
      <div className='items-center justify-between text-center p-4 bg-blue-100 m-4 rounded-full'>
        <div className='p-4 m-4'>
          <h3>Name:</h3>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div className=' p-4 m-4'>
          <h3>  Todo:</h3>
          <input type="text" id="todo" value={todo} onChange={handleTodoChange} />
        </div>
        <button className='m-8 p-2 bg-gray-300 hover:bg-gray-500 rounded-lg' onClick={addToList} >Submit</button>
      </div>
      {
        todos.length ?
        <div className="items-center justify-betwenn text-between p-4 m-4 bg-yellow-100">
          <div className="mb-2"> List of todos: </div>
          <ul>
            {
              todos.map(todo => <li key={todo.id} className="mb-2">
                  <div>{todo.todo}</div>
                </li>
              )
            }
          </ul>
        </div>
        : <h2>List is empty</h2>
      }
    </div>
  )
}

export async function getServerSideProps() {
  console.log(" wsdfj ")
  let {data} = await client.query({
    query: gql `
    query {
      getList {
        id
        name
        todo
      }
    }
    `
  })
  console.log(data)
  return { props: { data } };
}

export default Todo