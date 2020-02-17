import React, { useState, useEffect } from 'react'
import './Home.css'

import PageTitle from './../Template/PageTitle/PageTitle'
import Stat from '../Template/Stat/Stat'
import axios from 'axios'
import { baseApiUrl, userKey } from './../../global'

// Criar conexão axios
export default function Home() {
    const [stat, setData] = useState({})
    
    // O useEffect entra em loop, basta passar como segundo parametro um array
    useEffect(() => {
        async function loadStats() {
            const response = await axios.get(`${baseApiUrl}/stats`, {
                headers: { Authorization: `bearer ${JSON.parse(localStorage.getItem(userKey)).token}` }
            })
            setData(response.data)
        }
        loadStats()
    }, [])

    return (
        <div className="home">
            <PageTitle icon="fa fa-home" namePage="Dashboard" subtitle="Base de Conhecimento" />
            <div className='stats'>
                <Stat title="Categorias" value={stat.categories} icon="fa fa-folder" color="#d54d50" />
                <Stat title="Artigo" value={stat.articles} icon="fa fa-file" color="#3bc480" />
                <Stat title="Usuário" value={stat.users} icon="fa fa-user" color="#3282cd" />
            </div>
        </div>
    )
}