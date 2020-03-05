import React from 'react'
import "./Style.css"

import Main from './components/Main'

import { Provider } from 'react-redux'
import store from './store'

// const json = localStorage.getItem('__knowledge_user')
// const userData = JSON.parse(json)
// const Authorization = `bearer ${userData.token}`
// require('axios').defaults.headers.common['Authorization'] = `${Authorization}`

// Agora deve aumentar o tamanho da grid para cotent content
const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </ Provider >
  )
}
export default App