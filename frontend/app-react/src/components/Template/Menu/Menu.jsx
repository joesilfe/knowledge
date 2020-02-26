import React, { memo } from 'react'
import './Menu.css'

//remover
import { useSelector } from 'react-redux'

// import { baseApiUrl } from './../../../global'
// import axios from 'axios'

 function Menu() {

    console.log('Criar arvore de categorias para navegar. https://material-ui.com/pt/components/tree-view/')

    const show = useSelector(state => state)


    // const [search, setSearch] = useState([])

    // useEffect(() => {
    //     async function getTreeData() {
    //         const url = `${baseApiUrl}/categories/tree`
    //         await axios.get(url).then(res =>
    //             console.log(res.data)
    //         )
    //     }
        
    //     show.user.token && getTreeData()
    // }, [show.user.token])

    return (
        <div>
            {show.isVisible &&
                <aside className="menu">Aside</aside>}
        </ div>
    )
}

export default memo(Menu)

