import React, { useState, useEffect, memo } from 'react'
import './AdminArticles.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { modules, formats } from '../../../config/quilljsConfig'

import { ToastContainer } from 'react-toastify';
import { success, info, erro } from './../../../config/msgs'

import { Table, ButtonToolbar, Button, Form, Col } from 'react-bootstrap'

import { baseApiUrl, showError } from './../../../global'
import axios from 'axios'

function AdminArticles() {
    console.log('Fazer paginação')
    console.log('Criar componente do select')

    const [users, setUsersData] = useState([])
    const [categories, categoriesData] = useState([])
    const [articles, articlesData] = useState([])

    const [data, setData] = useState({})
    const [articlesName, setArticlesName] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [userId, setUserId] = useState('')

    function loadArticles(page) {
        const url = page ? `${baseApiUrl}/articles?page=${page}` : `${baseApiUrl}/articles`
        return axios.get(url).then(res => articlesData(res.data))
    }

    function dataArticle(categoria) {
        setData({id: categoria.id, userId: categoria.userId})
        setUserId(categoria.userId)
        setCategoryId(categoria.categoryId)
        setArticlesName(categoria.nome)
        setDescription(categoria.description)
        setImageUrl(categoria.imageUrl)
        setContent(categoria.content)
    }

    function updateArticle(id) {
        return axios.get(`${baseApiUrl}/articles/${id}`).then(res => {
            dataArticle(res.data)
        })
            .catch(showError)
    }
    
    function loadCategories() {
        return axios.get(`${baseApiUrl}/categories`).then(res => categoriesData(res.data))
    }

    function loadUsers() {
        return axios.get(`${baseApiUrl}/users`).then(res => setUsersData(res.data))
    }

    function articleSave(e) {
        e.preventDefault()

        if (content) {
            axios.post(`${baseApiUrl}/articles/`, {
                nome: articlesName,
                description,
                imageUrl,
                content,
                categoryId,
                userId,
            })
                .then(() => {
                    success()
                    reset()
                })
                .catch(showError)
        }
        else { erro("Conteúdo não informado") }

    }

    function articleUpdate(e) {
        e.preventDefault()

        if ( content && articlesName && description && categoryId && userId && data.id ) {
            axios.put(`${baseApiUrl}/articles/${data.id}`, {
                nome: articlesName,
                description,
                imageUrl,
                content,
                categoryId,
                userId,
            })
                .then(() => {
                    success()
                    reset()
                })
                .catch(showError)
        }
        else { erro("Conteúdo não informado") }

    }

    function articleDelete(id) {
        axios.delete(`${baseApiUrl}/articles/${id}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function reset(msg = "") {
        // limpar todos os campos
        setArticlesName('')
        setDescription('')
        setCategoryId('')
        setImageUrl('')
        setContent('')
        setUserId('')
        setUserId('Selecione um autor')
        setCategoryId('Selecione uma categoria')

        if (msg !== '') info(msg)
        loadArticles()
        setData({})
    }

    // O useEffect entra em loop, basta passar como segundo parametro um array
    useEffect(() => {
        loadArticles()
        loadCategories()
        loadUsers()
        // loadPagination()
    }, [])


    return (
        <div className="articles-admin">
            <Form>
                <Form.Row>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="articles-name"
                            placeholder="Escreva o nominho do artigo"
                            value={articlesName}
                            onChange={e => setArticlesName(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-description">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="articles-description"
                            placeholder="Escreva uma descrição"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-imageUrl">
                        <Form.Label>Imagem(URL)</Form.Label>
                        <Form.Control
                            type="text"
                            name="articles-imageUrl"
                            placeholder="Copie e cole a URL da imagem"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" sm="12" controlId="article-categorie-id">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control as="select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value='Selecione uma categoria'>Selecione uma categoria</option>
                            {categories.map(categorie =>
                                <option value={categorie.id} key={categorie.id}>{categorie.path}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="6" sm="12" controlId="user-article-id">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control as="select" value={userId} onChange={e => setUserId(e.target.value)}>
                            <option value='Selecione um autor'>Selecione um autor</option>
                            {users.map(user =>
                                <option value={user.id} key={user.id}>{user.nome}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="article-content">
                        <Form.Label>Conteúdo</Form.Label>
                        <ReactQuill
                            theme="snow"
                            onChange={e => setContent(e)}
                            modules={modules}
                            formats={formats}
                            value={content}
                            placeholder='Escreva o que está pensando' />
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <Button
                        variant={data.userId ? "success" : "primary"}
                        type="submit"
                        onClick={data.userId ? e => articleUpdate(e) : e => articleSave(e)}
                    >
                        {data.userId ? "Atualizar" : "salvar"}
                    </Button>
                    <Button
                        variant="link"
                        onClick={() => reset('Todos os campos estão limpos!')}
                    >
                        {data.userId ? "Cancelar" : "Limpar"}
                    </Button>
                </ Form.Group>
            </Form>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.data ? articles.data.map((article, index) =>
                        <tr key={index}>
                            <td key={article.id}>{index + 1}</td>
                            <td key={(index + article.id) + (article.id + index + 1)}>{article.nome}</td>
                            <td key={article.path}>{article.description}</td>
                            <td key={article.id + 1}>
                                <ButtonToolbar>
                                    <Button variant="warning" onClick={() => updateArticle(article.id)}><i className="fa fa-edit"></i></Button>
                                    <Button variant="danger" onClick={() => articleDelete(article.id)}><i className="fa fa-trash"></i></Button>
                                </ButtonToolbar>
                            </td>
                        </tr>
                    ) : <tr><td></td></tr>}
                </tbody>
            </Table>
            <ToastContainer />
        </div>
    )
}

export default memo(AdminArticles)