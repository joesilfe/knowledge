import React from 'react'
import './AdminPage.css'

import { Tab, Tabs } from 'react-bootstrap'

import PageTitle from '../Template/PageTitle/PageTitle'
import AdminArticles from './Articles/AdminArticles'
import AdminCategory from './Category/AdminCategory'
import AdminUser from './User/AdminUser'

export default function AdminPage() {
    return (
        <div className="admin-pages">
            <PageTitle icon="fa fa-cogs" namePage="Administração do Sistema" subtitle="Cadastro & Cia" />
            <div className="admin-pages-tabs">
                <Tabs defaultActiveKey="artigos" id="uncontrolled-tab-example">
                    <Tab eventKey="artigos" title="Artigos">
                        <AdminArticles />
                    </Tab>
                    <Tab eventKey="categorias" title="Categorias">
                        <AdminCategory />
                    </Tab>
                    <Tab eventKey="usuario" title="Usuário">
                        <AdminUser />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}