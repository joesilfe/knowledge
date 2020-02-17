import React, { useState, useEffect } from 'react'
import './AdminCategory.css'

import { ToastContainer } from 'react-toastify';
import { success, info, erro } from './../../../config/msgs'

import { Table, ButtonToolbar, Button, Form, Col } from 'react-bootstrap'

import { baseApiUrl, showError } from './../../../global'
import axios from 'axios'

export default function AdminCategorie() {
    
    console.log('O pai não pode ser filho do próprio filho')
    
    // const [mode, modeData] = useState('save')
    const [cData, categorieData] = useState({})
    const [categories, categoriesData] = useState([])
    
    
    function loadCategorie(categorieEdit) {
        document.querySelector('input[name="categorie-name"]').value = categorieEdit.name
        categorieData({ ...categorieEdit })
        
    }
    
    
    async function loadCategories() {
        await axios.get(`${baseApiUrl}/categories`).then(res => categoriesData(res.data))
    }

    function save(e) {
        e.preventDefault()
        
        const method = cData.id ? 'put' : 'post'
        const urlId = cData.id ? `${cData.id}` : ''        
        cData.parentId = cData.parentId === '' ? cData.parentId = null : cData.parentId


        parseInt(cData.id) === parseInt(cData.parentId) ? erro('Não é possível vincular em uma mesma categoria') :
        
        axios[method](`${baseApiUrl}/categories/${urlId}`, cData)
        .then(() => {
            success()
            reset()
        })
        .catch(showError)
        
    }

    function remove(id) {
        const urlId = id
        axios.delete(`${baseApiUrl}/categories/${urlId}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function reset(msg = "") {
        // limpar todos os campos
        document.querySelector('input[name="categorie-name"]').value = ''        
        document.querySelector("select#categorie-parentId").value = ' '
        if(msg !== '') info(msg)
        loadCategories()
        categorieData({})
    }

    // O useEffect entra em loop, basta passar como segundo parametro um array
    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <div className="categorie-admin">
            <Form>
                <Form.Control type="hidden" id='categorie-id' key={cData.id} value={cData.id} />
                <Form.Row>
                    <Form.Group as={Col} md="12" sm="12" controlId="categorie-name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="categorie-name" placeholder="Escreva o nominho da categoria" onChange={e => categorieData({ ...cData, name: e.target.value })} required />
                    </Form.Group>
                    <Form.Group as={Col} controlId="categorie-parentId">
                        <Form.Label>Categoria Pai</Form.Label>
                        <Form.Control as="select" onChange={e => categorieData({ ...cData, parentId: e.target.value})}>
                            <option value=''>...</option>
                            {categories.map(categorie =>
                                <option value={categorie.id} key={categorie.id}>{categorie.path}</option>
                            )}
                        </Form.Control>
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
                                    <Button variant="warning" onClick={() => loadCategorie(categorie)}><i className="fa fa-edit"></i></Button>
                                    <Button variant="danger" onClick={() => remove(categorie.id)}><i className="fa fa-trash"></i></Button>
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