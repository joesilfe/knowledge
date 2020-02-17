import React, { useState, useEffect } from 'react'
import './AdminUser.css'

import { ToastContainer } from 'react-toastify';
import { success, info } from './../../../config/msgs'

import { Table, ButtonToolbar, Button, Form, Col, Alert } from 'react-bootstrap'
import Switch from 'react-switch'

import { baseApiUrl, showError } from './../../../global'
import axios from 'axios'

export default function UserCategory() {

    const [data, setData] = useState({}) // carrega dados de usuários
    const [users, setUsers] = useState([]) // carrega usuários sendo ativos e inativos

    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userAdmin, setUserAdmin] = useState(false)
    const [userPassword, setUserPassword] = useState('')
    const [userConfirmPassword, setUserConfirmPassword] = useState('')

    // console.log('implementar YUP react na aplicação https://github.com/jquense/yup')

    function userSave(e) {
        e.preventDefault()
        axios.post(`${baseApiUrl}/users`,
            {
                nome: userName,
                email: userEmail,
                admin: userAdmin,
                password: userPassword,
                confirmPassword: userConfirmPassword
            })
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function userUpdate(e) {
        e.preventDefault()
        axios.put(`${baseApiUrl}/users/${data.id}`,
            {
                nome: userName,
                email: userEmail,
                admin: userAdmin,
            })
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function userDesable(id) {
        axios.delete(`${baseApiUrl}/users/${id}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function userEnable(id) {
        const urlId = id
        axios.put(`${baseApiUrl}/usersInativos/${urlId}`)
            .then(() => {
                success()
                reset()
            })
            .catch(showError)
    }

    function reset(msg = "") {
        // limpar todos os campos
        setUserName('')
        setUserEmail('')
        setUserAdmin(false)
        setUserPassword('')
        setUserConfirmPassword('')

        // retorna mensagem
        if (msg !== '') info(msg)

        // limpa os dados de usuários
        setData({})
    }

    function userEdit(userEdit) {
        setUserName(userEdit.nome)
        setUserEmail(userEdit.email)
        setUserAdmin(userEdit.admin)
        setData({ ...userEdit })
    }

    function loadUsers(loadUserInative) {
        return loadUserInative === true ?
            axios.get(`${baseApiUrl}/usersInativos`).then(res => setUsers(res.data))
            : axios.get(`${baseApiUrl}/users`).then(res => setUsers(res.data))
    }

    // O useEffect entra em loop, basta passar como segundo parametro um array vazio
    useEffect(() => {
        loadUsers()
    }, [])

    return (
        <div className="User-admin">
            <Form onSubmit={userSave}>
                <Form.Row>
                    <Form.Group as={Col} md="6" sm="12" controlId="user-name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="user-name"
                            placeholder="Escreva o nominho"
                            value={userName} onChange={e => setUserName(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" sm="12" controlId="user-email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="user-email"
                            placeholder="Digite um e-mail"
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                            required />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="6" sm="12">
                        <Form.Label>
                            <Switch
                                onChange={() => setUserAdmin(!userAdmin)}
                                checked={userAdmin}
                                height={16}
                                width={28}
                                handleDiameter={12}
                                offColor="#08f"
                                onColor="#28a745"
                                onHandleColor="#fff"
                                offHandleColor="#fff"
                                className="react-switch"
                                id="user-admin"
                            />
                            <span>É Administrador?</span>
                        </Form.Label>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    {data.status ? null :
                        <>
                            <Form.Group as={Col} md="6" sm="12" controlId="user-password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Crie uma senha"
                                    value={userPassword}
                                    onChange={e => setUserPassword(e.target.value)}
                                    required />
                            </Form.Group>
                            <Form.Group as={Col} md="6" sm="12" controlId="user-confirPassword">
                                <Form.Label>Confirmar senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Digite a mesma senha"
                                    value={userConfirmPassword}
                                    onChange={e => setUserConfirmPassword(e.target.value)}
                                    required />
                            </Form.Group>
                        </>
                    }
                </Form.Row>
                <Form.Group>
                    {data.status ?
                        <Button
                            variant="success"
                            onClick={userUpdate} >
                            Atualizar
                        </Button>
                        :
                        <Button
                            variant="primary"
                            type="submit">
                            Salvar
                        </Button>
                    }
                    <Button
                        variant="link"
                        onClick={() => reset('Todos os campos estão limpos!')}>
                        {data.status ? 'Cancelar' : 'Limpar'}
                    </Button>
                </ Form.Group>
                <Form.Row>
                    <Form.Group as={Col} md="12" sm="12">
                        <Alert key={'info'} variant={'info'}>
                            <b>Você sabia que pode ver usuários que já foram excluídos e reativalos? Legal né?</b>
                            <Form.Check
                                type="switch"
                                id="user-inativo"
                                label="Mostrar usuários inativos"
                                className='mt-3 mb-3'
                                chechked={true}
                                onClick={e => loadUsers(e.target.checked)}
                            />
                        </Alert>
                    </Form.Group>
                </Form.Row>
            </Form>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Administrador</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) =>
                        <tr key={index}>
                            <td key={user.id}>{index + 1}</td>
                            <td key={user.nome}>{user.nome}</td>
                            <td key={user.email}>{user.email}</td>
                            <td key={user.admin}>{`${user.admin ? 'Sim' : 'Não'}`}</td>
                            <td key={user.id + 1}>
                                <ButtonToolbar>
                                    {user.deletedAt && <Button variant="success" onClick={() => userEnable(user.id)}>Ativar</Button>}
                                    {!user.deletedAt && <Button variant="warning" onClick={() => userEdit({ ...user, status: true })}><i className="fa fa-edit"></i></Button>}
                                    {!user.deletedAt && <Button variant="danger" onClick={() => userDesable(user.id)}><i className="fa fa-trash"></i></Button>}
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