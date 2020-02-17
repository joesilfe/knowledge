import React, { useState, useEffect } from 'react'
import './AdminArticles.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { modules, formats } from '../../../config/quilljsConfig'

import { ToastContainer } from 'react-toastify';
import { success, info, erro } from './../../../config/msgs'

import { Table, ButtonToolbar, Button, Form, Col } from 'react-bootstrap'

import { baseApiUrl, showError } from './../../../global'
import axios from 'axios'

export default function AdminArticles() {

    console.log('Limpar campo de conteúdo')
    console.log('Fazer paginação')

    const [users, usersData] = useState([])
    const [categories, categoriesData] = useState([])

    const [aData, articleData] = useState({})
    const [articles, articlesData] = useState([])    

    console.log(aData)

    function loadUpdateArticle(date) {
        document.querySelector('input[name="articles-name"]').value = date.nome
        document.querySelector('input[name="articles-descricao"]').value = date.description
        document.querySelector('input[name="articles-imageUrl"]').value = date.imageUrl
        document.querySelector('.ql-editor').innerHTML = date.content
    }

    function updateArticle(id) {
        const url = `${baseApiUrl}/articles/${id}`
        return axios.get(url).then(res => {
            loadUpdateArticle(res.data)
        })
            .catch(showError)
    }

    function loadArticles(page) {
        const url = page ? `${baseApiUrl}/articles?page=${page}` : `${baseApiUrl}/articles`
        return axios.get(url).then(res => articlesData(res.data))
    }

    function loadCategories() {
        return axios.get(`${baseApiUrl}/categories`).then(res => categoriesData(res.data))
    }

    function loadUsers() {
        return axios.get(`${baseApiUrl}/users`).then(res => usersData(res.data))
    }

    function save(e) {
        e.preventDefault()

        const method = aData.id ? 'put' : 'post'
        const urlId = aData.id ? `${aData.id}` : ''

        if (aData.content !== undefined && aData.content !== "") {
            axios[method](`${baseApiUrl}/articles/${urlId}`, aData)
                .then(() => {
                    success()
                    reset()
                    document.location.reload(true);
                })
                .catch(showError)
        }
        else { erro("Conteúdo não informado") }

    }

    function remove(id) {
        const urlId = id
        axios.delete(`${baseApiUrl}/articles/${urlId}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function reset(msg = "") {
        // limpar todos os campos
        document.querySelectorAll('input').forEach(e => e.value = '')
        document.querySelectorAll('select').forEach(e => e.value = '')

        if (msg !== '') info(msg)
        loadArticles()
        articleData({})
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
                <Form.Control type="hidden" id='articles-id' key={aData.id} value={aData.id} />
                <Form.Row>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="articles-name" placeholder="Escreva o nominho do artigo" onChange={e => articleData({ ...aData, nome: e.target.value })} required />
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control type="text" name="articles-descricao" placeholder="Escreva uma descrição" onChange={e => articleData({ ...aData, description: e.target.value })} required />
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="articles-imageUrl">
                        <Form.Label>Imagem(URL)</Form.Label>
                        <Form.Control type="text" name="articles-imageUrl" placeholder="Copie e cole a URL da imagem" onChange={e => articleData({ ...aData, imageUrl: e.target.value })} required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" sm="12" controlId="article-categorie-id">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control as="select" onChange={e => articleData({ ...aData, categoryId: e.target.value })}>
                            <option value=''>Selecione uma categoria</option>
                            {categories.map(categorie =>
                                <option value={categorie.id} key={categorie.id}>{categorie.path}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="6" sm="12" controlId="user-article-id">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control as="select" onChange={e => articleData({ ...aData, userId: e.target.value })}>
                            <option value=''>Selecione um autor</option>
                            {users.map(user =>
                                <option value={user.id} key={user.id}>{user.nome}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="12" sm="12" controlId="article-content">
                        <Form.Label>Conteúdo</Form.Label>
                        <ReactQuill theme="snow"  onChange={ e => articleData({...aData, content: e}) } modules={modules} formats={formats} placeholder='Escreva o que está pensando' />
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <Button variant="primary" type="submit" onClick={e => save(e)}>Salvar</Button>
                    {/* <Button variant="danger" type="submit" >Excluir</Button> */}
                    <Button variant="link" onClick={e => reset('Todos os campos estão limpos!')}>limpar</Button>
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
                                    <Button variant="danger" onClick={() => remove(article.id)}><i className="fa fa-trash"></i></Button>
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