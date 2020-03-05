import React, { useState, useEffect, memo } from 'react'
import './Menu.css'

import MenuItem from './../Itens/ItemMenu'

//remover
import { useSelector } from 'react-redux'

import { baseApiUrl } from './../../../global'
import axios from 'axios'

function Menu(props) {

    console.log('Criar arvore de categorias para navegar. https://material-ui.com/pt/components/tree-view/')

    const show = useSelector(state => state)

    const [search, setSearch] = useState([])

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
            {show.isVisible &&
                <aside className="menu">
                    {search.map( (item, index) => <MenuItem {...item} key={index} />)}
                </aside>}
        </ div>
    )
}

export default memo(Menu)

