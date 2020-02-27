import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react'

import { BrowserRouter } from 'react-router-dom'

import Header from './Template/Header/Header'
import Menu from './Template/Menu/Menu'
import Content from './Template/Content/Content'
import Footer from './Template/Footer/Footer'
import Loading from './Template/Loading/Loading'

import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { baseApiUrl, userKey } from './../global'

import '../config/axios'


export default function Layout({ history }) {

    const show = useSelector(state => state)

    const [validatingToken, setValidatingToken] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        async function validateToken() {
            setValidatingToken(true)

            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)

            console.log(userData)

            dispatch({ type: 'SET_USER', user: { name: null, email: null } })

            if (!userData) {
                setValidatingToken(false)
                return
            }

            await axios.post(`${baseApiUrl}/validateToken`, userData).then(res => {
                if (res.data) {
                    dispatch({ type: 'SET_USER', user: userData })
                } else {
                    localStorage.removeItem(userKey)
                    return history.push('/')
                }
            }).catch(res => console.log(res))

            if (window.location.pathname === '/admin') {
                await axios.post(`${baseApiUrl}/validateTokenUser`, userData).then(res => {
                    if (res.data[0].admin) {
                        return dispatch({ type: 'SET_USER', user: userData })
                    } else {
                        localStorage.removeItem(userKey)
                        dispatch({ type: 'SET_USER', user: { name: null, email: null } })
                        return history.push('/')
                    }
                }).catch(res => console.log(res))
            }

            setValidatingToken(false)

        }

        validateToken()
    }, [history, dispatch ])

    return (
        <BrowserRouter>
            <div className={show.isVisible ? 'app' : 'app hide-menu'}>
                <Header title='Cod3r - Base de conhecimento' isVisibleToggle={show.user.name !== '' && show.user.name !== null ? true : false} isVisibleMenu={true} />
                <Menu />
                {validatingToken ? <Loading /> : <Content />}
                <Footer />
            </div>
        </BrowserRouter>
    )
}

