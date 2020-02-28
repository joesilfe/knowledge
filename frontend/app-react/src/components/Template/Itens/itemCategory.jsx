import React, { memo } from 'react';

import { ButtonToolbar, Button } from 'react-bootstrap'

function Itens({ index, categorie, setDataCategorie, categorieDelete }) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{categorie.name}</td>
            <td>{categorie.path}</td>
            <td>
                <ButtonToolbar>
                    <Button variant="warning" onClick={() => setDataCategorie(categorie)}><i className="fa fa-edit"></i></Button>
                    <Button variant="danger" onClick={() => categorieDelete(categorie.id)}><i className="fa fa-trash"></i></Button>
                </ButtonToolbar>
            </td>
        </tr>
    )
}

export default memo(Itens)