import React, { useState, useEffect } from 'react'
import './Menu.css'

import { useSelector } from 'react-redux'

import { baseApiUrl } from './../../../global'
import axios from 'axios'

export default function Menu() {

    const [search, setSearch] = useState({})

    console.log('Criar arvore de categorias para navegar. https://material-ui.com/pt/components/tree-view/')
    console.log(search)

    const show = useSelector(state => state)

    console.log(show)

    useEffect(() => {
        async function getTreeData() {
            const url = `${baseApiUrl}/categories/tree`
            await axios.get(url).then(res =>
                setSearch(res.data)
            )
        }

        show.user.token && getTreeData()
    }, [show.user.token])

    return (
        <div>
            {show.isVisible && <aside className="menu">outsite</aside>}
        </ div>

    )
}

