import React, { memo } from 'react';

import { ButtonToolbar, Button } from 'react-bootstrap'

function Itens({ index, user, userEnable, userEdit, userDesable }) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{user.nome}</td>
            <td>{user.email}</td>
            <td>{`${user.admin ? 'Sim' : 'Não'}`}</td>
            <td>
                <ButtonToolbar>
                    {user.deletedAt && <Button variant="success" onClick={() => userEnable(user.id)}>Ativar</Button>}
                    {!user.deletedAt && <Button variant="warning" onClick={() => userEdit({ ...user, status: true })}><i className="fa fa-edit"></i></Button>}
                    {!user.deletedAt && <Button variant="danger" onClick={() => userDesable(user.id)}><i className="fa fa-trash"></i></Button>}
                </ButtonToolbar>
            </td>
        </tr>
    )
}

export default memo(Itens)