import React, { useState, useEffect, useCallback } from 'react'
import './ArticlesByCategory.css'

import { baseApiUrl } from './../../../global'
import axios from 'axios'

import PageTitle from './../../Template/PageTitle/PageTitle'
import { Button } from 'react-bootstrap'
import ArticleItem from './../ArticleItem/ArticleItem'

export default function ArticlesByCategory(props) {

    console.log('analisar porque botão não está carregando outros artigos ou sumindo')

    // capturando o ID pela url
    const { match } = props

    const [page, setPage] = useState(1)
    const [loadMore, setLoadMore] = useState(true)
    const [category, setCategory] = useState({ id: parseInt(match.params.id) })
    const [articles, setArticles] = useState([])

    // console.log(category)
    // console.log(articles)     

    function getCategory() {
        
    }

    const memoizedCallback = useCallback(() => {
        const url = `${baseApiUrl}/categories/${category.id}`
        return axios.get(url).then(res => setCategory(res.data))
        },[category]
    )

    useEffect(() => {
         function getArticles() {
            const url = `${baseApiUrl}/categories/${category.id}/articles?page=${page}`
            return axios.get(url).then(res => {
                setArticles(res.data)
                setPage(+1)
                if(res.data.length === 0) setLoadMore(false)
            })
        } 
        memoizedCallback()
        getArticles()
        getCategory()
    }, [memoizedCallback, category.id, loadMore, page ])

    return (
        <div className="articles-by-category">
            <PageTitle icon="fa fa-folder-o" namePage={category.name} subtitle="Categoria" />
            <ul>
                {articles.map((article, index) =>
                    <li key={index}><ArticleItem article={article}/></li>
                )}
            </ul>
            <div className="load-more">
                    { loadMore && <Button variant="primary" size="lg" onClick={() => getCategory()}>Carregar mais artigos</Button>}
            </div>
        </div>
    )

}