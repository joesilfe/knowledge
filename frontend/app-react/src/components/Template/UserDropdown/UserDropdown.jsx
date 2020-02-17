import React from 'react'
import './UserDropdown.css'
import { Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import { userKey } from './../../../global'

import Gravatar from 'react-gravatar'

import { useSelector } from 'react-redux'

export default function UserDropdown() {

    const dispatch = useDispatch()
    const show = useSelector(state => state)

    function handleSubmit() {
        try {
            localStorage.removeItem(userKey)
            dispatch({
                type: 'SET_USER',
                user: {
                    name: null,
                    email: null
                }
            })
        }catch(e){
            console.log(e)
        }

    }

    return (
        show.user.name !== '' && show.user.name !== null ?
            <div className="user-dropdown">
                <div className="user-button">
                    <span className="">Bem-vindo(a) - <b>{show.user.name.trim().split(" ", 1)}</b> </span>
                    <div className="user-dropdown-img">
                        <Gravatar email={show.user.email} alt="User" />
                    </div>
                    <i className="fa fa-chevron-down"></i>
                </div>
                <div className="user-dropdown-content">
                    {show.user.admin ? <Link to="/admin"><i className="fa fa-cogs"></i>Administração</Link> : null}
                    <Link to="/" onClick={handleSubmit}><i className="fa fa-sign-in"></i>Sair</Link>
                </div>
            </div>
            : null
    )
}