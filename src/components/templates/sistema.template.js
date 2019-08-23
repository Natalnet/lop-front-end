/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

import Swal from "sweetalert2";

import axios from "axios";

import ErrorBoundary from "screens/erros/errorBoundary.screen";

import HeadPefilMenu from "components/menus/comum/headPerfil.menu";

import MenuAluno from "components/menus/dashboard/aluno/menuAluno.menu";

import MenuAdministrador from "components/menus/dashboard/administrador/menuAdministrador.menu";

import MenuProfessor from "components/menus/dashboard/professor/menuProfessor.menu";

import { perfis } from "config/enums/perfis.enum";

export default class TemplateSistema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erros: [],
      keyErros: 0,
      perfil: perfis.ALUNO
    };
  }

  componentDidMount() {
    document.title = "Template de login";
    const perfilUsuario = this.getPerfilUsuario();
    const state = this.state;
    state.perfil = perfilUsuario;
    this.setState({ ...state });
    this.handleAxiosErros();
  }

  handleAxiosErros = () => {
    axios.interceptors.response.use(null, error => {
      if (error.response !== undefined) {
        if (
          error.response.status === 500 ||
          error.response.status === 400 ||
          error.response.status === 404
        ) {
          const { erros } = error.response.data;
          if(erros !== undefined){
            let text = erros.map(erro => {
              return `${erro.msg}`.replace(".", "");
            });
  
            Swal.fire({
              type: "error",
              title: `Erro ${error.response.status}`,
              text: text,
              confirmButtonText: "Voltar para o sistema"
            });
          } else{
            Swal.fire({
              type: "error",
              title: `Erro ${error.response.status}`,
              text: 'Erro ao processar requisição.',
              confirmButtonText: "Voltar para o sistema"
            });
          }
          
        } else {
          return Promise.reject(error);
        }
      }
    });
  };

  getPerfilUsuario = () => {
    const perfilDaUrl = window.location.pathname.slice(1);
    
    const arraySistemaPermisssao = perfilDaUrl.split('/');
    
    return arraySistemaPermisssao[0] === "sistema" ? arraySistemaPermisssao[1] : perfis.ALUNO;
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="page">
          <div className="page-main">
            <div className="header py-4">
              <div className="container">
                <HeadPefilMenu />
              </div>
            </div>
              <MenuProfessor/>
            <div className="my-3 my-md-5">
              <div className="container">
                <div className="page-header">
                  <h1 className="page-title"></h1>
                </div>
                {this.props.children}
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="container">
              <div style={{textAlign:"center"}}> 
              Plataforma LOP. Universidade Federal do Rio Grande do Norte
                  2019.
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    );
  }
}
