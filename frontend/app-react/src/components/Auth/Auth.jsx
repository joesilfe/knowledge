import React, { useState, useEffect } from 'react'
import './Auth.css'

import { ToastContainer } from 'react-toastify';
import { success } from './../../config/msgs'

import logo from './../../assets/logo.png'

import { baseApiUrl, showError, userKey } from './../../global'
import { useDispatch } from 'react-redux'

import axios from 'axios'

export default function Auth({ history }) {

    const [user, setUser] = useState({})
    const [showSignup, setShowSignup] = useState(false)

    const dispatch = useDispatch()

    function userLogin(user) {
        dispatch({ type: 'SET_USER', user: user })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        await axios.post(`${baseApiUrl}/signin`, user).then(res => {
            userLogin(res.data)
            localStorage.setItem(userKey, JSON.stringify(res.data))
            history.push('/home')
        }).catch(showError)

    }

    function signinOrSingUp(e) {
        e.preventDefault()
        return setShowSignup(!showSignup)
    }

    async function signup() {
        await axios.post(`${baseApiUrl}/signup`, user)
            .then(() => {
                success()
                setShowSignup(false)
                setUser({})
            })
            .catch(showError)
    }

    useEffect(() => {
        const json = localStorage.getItem(userKey)
        const userData = JSON.parse(json)

        if (userData) {
            history.push('/home')
            return
        }
    })

    return (
        <div className="auth-content">
            <div className="auth-modal">
                <img src={logo} alt="logo" width="200" />
                <hr />
                <div className="auth-title">{showSignup ? 'Cadastro' : 'Login '}</div>
                <form onSubmit={handleSubmit}>
                    {showSignup ? <input type="text" placeholder="Escreva seu nome" onChange={e => setUser({ ...user, nome: e.target.value })} /> : null}
                    <input type="email" placeholder="Escreva seu melhor e-mail" onChange={e => setUser({ ...user, email: e.target.value })} />
                    <input type="password" placeholder="Digite sua senha" onChange={e => setUser({ ...user, password: e.target.value })} />
                    {showSignup ? <input type="password" placeholder="Confirme sua Senha" onChange={e => setUser({ ...user, confirmPassword: e.target.value })} /> : null}
                    {showSignup ? <button type="submit" onClick={signup}>Registrar</button> : <button type="submit">Entrar</button>}
                </form>
                <a href="/" onClick={e => signinOrSingUp(e)}>
                    {showSignup ? <span>Possui cadastro? Faça login!</span> : null}
                    {!showSignup ? <span>Fazer um cadastro</span> : null}
                </a>
            </div>
            <ToastContainer />
        </div>
    )

}