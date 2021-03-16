/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";

import { Link } from 'react-router-dom';

export default class Error404 extends Component {
  
  // componentDidMount() {
  //   document.title = "Error404 - Plataforma LOP";
  // }

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="container text-center">
            <div className="display-1 text-muted mb-5">
              <i className="si si-exclamation" /> 404
            </div>
            <h1 className="h2 mb-3">Página não encontrada</h1>
            <p className="h4 text-muted font-weight-normal mb-7">
                Erro ao processar requisição.
            </p>
            <Link className="btn btn-primary" to={`/${sessionStorage.getItem('user.profile').toLocaleLowerCase()}`}>
              <i className="fe fe-arrow-left mr-2" />Voltar para o início 
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
