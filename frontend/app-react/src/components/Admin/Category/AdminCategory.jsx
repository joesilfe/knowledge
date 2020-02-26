import React, { useState, useEffect, memo } from 'react'
import './AdminCategory.css'

import { ToastContainer } from 'react-toastify';
import { success, info } from './../../../config/msgs'

import { Table, ButtonToolbar, Button, Form, Col } from 'react-bootstrap'

import { baseApiUrl, showError } from './../../../global'
import axios from 'axios'

function AdminCategorie() {

    const [cData, setCData] = useState({})
    const [categories, setCategories] = useState([])
    const [categorieName, setCategorieName] = useState('')
    const [categorieId, setCategorieId] = useState('...')

    async function loadCategories() {
        await axios.get(`${baseApiUrl}/categories`).then(res => setCategories(res.data))
    }

    function categorieSave(e) {
        e.preventDefault()

        axios.post(`${baseApiUrl}/categories/`, {
            name: categorieName,
            parentId: categorieId === '...' ? null : categorieId
        })
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function setDataCategorie(categorie) {
        setCData({ ...categorie })
        setCategorieName(categorie.name)
    }

    function categorieUpdate(e) {
        e.preventDefault()

        axios.put(`${baseApiUrl}/categories/${cData.id}`, {
            name: categorieName
        })
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function categorieDelete(id) {
        axios.delete(`${baseApiUrl}/categories/${id}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    async function reset(msg = "") {
        if (msg !== '') info(msg)

        loadCategories()
        await setCData({})

        // limpar todos os campos
        setCategorieName('')
        setCategorieId('...')
    }

    // O useEffect entra em loop, basta passar como segundo parametro um array
    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <div className="categorie-admin">
            <Form>
                <Form.Control
                    type="hidden"
                    id='categorie-id'
                    key={cData.id}
                    value={cData.id} />
                <Form.Row>
                    <Form.Group as={Col} md="12" sm="12" controlId="categorie-name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="categorie-name"
                            placeholder="Escreva o nominho da categoria"
                            value={categorieName}
                            onChange={e => setCategorieName(e.target.value)} required />
                    </Form.Group>
                    {cData.id ? null :
                        <Form.Group as={Col} controlId="categorie-parentId">
                            <Form.Label>Categoria Pai</Form.Label>
                            <Form.Control as="select" value={categorieId} onChange={e => setCategorieId(e.target.value)}>
                                <option value='...'>...</option>
                                {categories.map(categorie =>
                                    <option value={categorie.id} key={categorie.id}>
                                        {categorie.path}
                                    </option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    }
                </Form.Row>
                <Form.Group>
                    <Button
                        variant={cData.id ? "success" : "primary"}
                        type="submit"
                        onClick={cData.id ? e => categorieUpdate(e) : e => categorieSave(e)}
                    >
                        {cData.id ? 'Atualizar' : 'Salvar'}
                    </Button>

                    <Button
                        variant="link"
                        onClick={() => reset('Todos os campos estão limpos!')}
                    >
                        {cData.id ? 'Cancelar' : 'Limpar'}
                    </Button>
                </ Form.Group>
            </Form>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Caminho</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((categorie, index) =>
                        <tr key={index}>
                            <td key={categorie.id}>{index + 1}</td>
                            <td key={(index + categorie.id) + (categorie.id + index + 1)}>{categorie.name}</td>
                            <td key={categorie.path}>{categorie.path}</td>
                            <td key={categorie.id + 1}>
                                <ButtonToolbar>
                                    <Button variant="warning" onClick={() => setDataCategorie(categorie)}><i className="fa fa-edit"></i></Button>
                                    <Button variant="danger" onClick={() => categorieDelete(categorie.id)}><i className="fa fa-trash"></i></Button>
                                </ButtonToolbar>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <ToastContainer />
        </div>
    )
}

export default memo(AdminCategorie)