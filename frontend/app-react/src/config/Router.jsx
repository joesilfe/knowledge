import React from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'

import Home from './../components/Home/Home'
import AdminPage from './../components/Admin/AdminPage'
import ArticlesByCategory from './../components/Articles/ArticlesByCategory/ArticlesByCategory'
import ArticleById from '../components/Articles/ArticlesById/ArticleById'
import Auth from './../components/Auth/Auth'

import { Authorization } from './Autorization'

// console.log('manter página auth caso o usuário não estiover logado e tentar acessar outra tela')

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest}
        render={props => (
             Authorization() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: '/'}} />)
        )} />
)

export default props =>
    <Switch>
        <PrivateRoute path='/home' component={Home} />
        <PrivateRoute path='/admin' component={AdminPage} />
        <PrivateRoute path='/articlesByCategory/:id/articles' component={ArticlesByCategory} />
        <PrivateRoute path='/articleById/:id' component={ArticleById} />
        <Route exact path='/' component={Auth} />
        <Redirect from='*' to='/' />
    </ Switch>