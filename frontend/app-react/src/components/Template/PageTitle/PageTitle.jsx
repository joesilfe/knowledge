import React from 'react'
import './PageTitle.css'


export default function PageTitle(props) {
    return(
        <div className='page-title'>
            <h1><i className={ props.icon }></i> { props.namePage } </h1>
            <h2> {props.subtitle} </h2>
            <hr/>
        </div>
    )
}