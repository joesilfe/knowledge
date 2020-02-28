import React, { memo } from 'react';

import { ButtonToolbar, Button } from 'react-bootstrap'

function Itens({ article, index, updateArticle, articleDelete }) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{article.nome}</td>
            <td>{article.description}</td>
            <td>
                <ButtonToolbar>
                    <Button variant="warning" onClick={() => updateArticle(article.id)}><i className="fa fa-edit"></i></Button>
                    <Button variant="danger" onClick={() => articleDelete(article.id)}><i className="fa fa-trash"></i></Button>
                </ButtonToolbar>
            </td>
        </tr>
    )
}

export default memo(Itens)