import React from 'react'
import "./Style.css"

import Main from './components/Main'

import { Provider } from 'react-redux'
import store from './store'

// const Authorization = `bearer ${localStorage.getItem(userKey)}`
// require('axios').defaults.headers.common['Authorization'] = `bearer ${Authorization}`

// Agora deve aumentar o tamanho da grid para cotent content
const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </ Provider >
  )
}
export default App