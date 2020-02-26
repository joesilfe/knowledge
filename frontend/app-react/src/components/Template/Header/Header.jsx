import React from 'react'
import './Header.css'

import { Link } from 'react-router-dom'


import UserDropdown from './../UserDropdown/UserDropdown'

import { useDispatch, useSelector } from 'react-redux'

export default function Header(props) {
    const dispatch = useDispatch();

    function toggleMenu() {
        dispatch({ type: 'ADD_MENU' })
    }

    const show = useSelector(state => state)

    return (
        <header className="header">
            { props.isVisibleToggle && <a href="#/" className="toggle" onClick={toggleMenu}><i className={show.isVisible ? "fa fa-chevron-left" : "fa fa-chevron-right"}></i></a>}
            <h1 className="title">
                {<Link to={show.user.token ? "/home" : "/"}>{props.title}</Link>}
            </h1>
            {props.isVisibleMenu && <UserDropdown />}
        </header>
    )
}

