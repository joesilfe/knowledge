import React, { useState, useEffect, useCallback } from 'react'
import './ArticlesByCategory.css'

import { baseApiUrl } from './../../../global'
import axios from 'axios'

import PageTitle from './../../Template/PageTitle/PageTitle'
import { Button } from 'react-bootstrap'
import ArticleItem from './../ArticleItem/ArticleItem'

export default function ArticlesByCategory(props) {

    console.log('Fazer transição de navegação')
    console.log('estudar possibilidade de implementar https://hasura.io/ ou https://www.prisma.io/')

    // capturando o ID que se encontra na url
    const { match } = props

    // const [page, setPage] = useState(1)
    const [loadMore, setLoadMore] = useState(true)
    const [category, setCategory] = useState({ id: parseInt(match.params.id) })
    const [articles, setArticles] = useState([])
    const [cate, setCate] = useState([])

    console.log(category, ' cateogry')

    async function getCategory() {
        const url = `${baseApiUrl}/categories/${category.id}/articles?`
        return await axios.get(url).then(res => {
            if (res.data.length === articles.length) setLoadMore(false)
            setArticles(res.data)
        })
    }

    const getCategoryId = useCallback((id) => {
        const url = `${baseApiUrl}/categories/${id}`
        return axios.get(url).then(res => {
            setCate(res.data)
        })
    }, [])

    useEffect(() => {

        if (category.id !== parseInt(match.params.id))
            setCategory(parseInt(match.params.id))

    }, [category, match.params.id])

    useEffect(() => {

        async function getAllArticles() {
            const url = `${baseApiUrl}/categories/${category.id}/articles`
            return await axios.get(url).then(res => {
                setArticles(res.data)
            })
        }

        if (category.id) getCategoryId(category.id)

        getAllArticles()
    }, [category, getCategoryId])

    return (
        <div className="articles-by-category">
            <PageTitle icon="fa fa-folder-o" namePage={cate.name} subtitle="Categoria" />
            <ul>
                {articles.map((article, index) =>
                    <li key={index}><ArticleItem article={article} /></li>
                )}
            </ul>
            <div className="load-more">
                {loadMore && <Button variant="primary" size="lg" onClick={() => getCategory()}>Carregar mais artigos</Button>}
            </div>
        </div>
    )

}