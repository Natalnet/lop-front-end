import React, { Component } from "react";

import Swal from "sweetalert2";

import axios from "axios";

import ErrorBoundary from "screens/erros/errorBoundary.screen";

import HeadPefilMenu from "components/menus/comum/headPerfil.menu";
import MenuAdministrador from "components/menus/dashboard/administrador/menuAdministrador.menu";

export default class TemplateSistema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erros: [],
      keyErros: 0
    };
  }
  componentDidMount() {
    document.title = "Template de login";

    axios.interceptors.response.use(null, error => {
      if (error.response !== undefined) {
        if (
          error.response.status === 500 ||
          error.response.status === 400 ||
          error.response.status === 404
        ) {
          const { erros } = error.response.data;

          let text = erros.map(erro => {
            return `${erro.msg}`.replace(".", "");
          });

          Swal.fire({
            type: "error",
            title: `Erro ${error.response.status}`,
            text: text,
            confirmButtonText: "Voltar para o sistema"
          });
        } else {
          return Promise.reject(error);
        }
      }
    });
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
            <MenuAdministrador />
            <div className="my-3 my-md-5 ">
              <div className="container">{this.props.children}</div>
            </div>
          </div>
          <footer className="footer">
            <div className="container">
              <div style={{ textAlign: "center" }}>
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
