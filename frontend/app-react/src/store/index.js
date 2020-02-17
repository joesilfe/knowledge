import axios from 'axios'
import { createStore, applyMiddleware, compose } from 'redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const INICITAL_STATE = {
    isVisible: false,
    user: {
        name: null,
        email: null
    }
}

function componenteReducer(state = INICITAL_STATE, action) {
    
    // responsável por abrir e fechar aside
    if (action.type === 'ADD_MENU') {                
        if (action.isVisible === undefined) {
            return {...state, data: state.isVisible = !state.isVisible}
        } else state.isVisible = action.isVisible
    }
        
    // Setando usuário
    if (action.type === 'SET_USER') { 
        state.user = action.user        
        if(action.user){            
            axios.defaults.headers.common['Authorization'] = `bearer ${action.user.token}`
            state.isVisible = false
            return {...state}
        }else {
            delete axios.defaults.headers.common['Authorization']
            state.isVisible = false
        }
    } else return state
    
}

const store = createStore(componenteReducer, composeEnhancers(applyMiddleware()))

export default store;