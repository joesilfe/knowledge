import React from 'react'
import './ArticleItem.css'

import { Link } from 'react-router-dom'
import image from './../../../assets/article.png'

export default function ArticleItem(props) {
    return (        
        <div className="article-item">
            {props.article.imageUrl = ''}
            <Link to={`/ArticleById/${props.article.id}`}>
                <div className="article-item-image d-none d-sm-block">
                    <img src={props.article.imageUrl.trim() || image} alt="article" height="150" width="150" />
                </div>
                <div className="article-item-info">
                    <h2>{props.article.nome}</h2>
                    <p>{props.article.description}</p>
                    <span className='article-item-author'>
                        <strong>Autor: </strong>{props.article.author}
                    </span>
                </div>
            </Link>
        </div>
    )
}