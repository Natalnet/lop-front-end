/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";

import { Link } from 'react-router-dom';

export default class Error404 extends Component {
  state = {
    perfil: localStorage.getItem("user.profile")
  }
  componentDidMount() {
    document.title = "Error404 - Plataforma LOP";
  }

  retornar(){
    if(this.state.perfil==='PROFESSOR'){
      return(<Link className="btn btn-primary" to="/professor/turmas">
          <i className="fe fe-arrow-left mr-2" />Voltar para o início
      </Link>)
    }
    else if(this.state.perfil==='ADMINISTRADOR'){
      return(<Link className="btn btn-primary" to="/administrador/usuarios">
          <i className="fe fe-arrow-left mr-2" />Voltar para o início
      </Link>)
    }
    else if(this.state.perfil==='ALUNO'){
      return(<Link className="btn btn-primary" to="/aluno">
          <i className="fe fe-arrow-left mr-2" />Voltar para o início
      </Link>)
    }
  }

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="container text-center">
            <div className="display-1 text-muted mb-5">
              <i className="si si-exclamation" /> 401
            </div>
            <h1 className="h2 mb-3">Usuário não autorizado</h1>
            <p className="h4 text-muted font-weight-normal mb-7">
              Você tentou acessar uma página que não é permitida!
            </p>
            {this.retornar()}
          </div>
        </div>
      </div>
    );
  }
}
