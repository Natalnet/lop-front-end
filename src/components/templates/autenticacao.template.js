/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

import Swal from "sweetalert2";

import axios from "axios";

import ErrorBoundary from"../../screens/erros/errorBoundary.screen";

export default class TemplateAutenticacao extends Component {
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
            icon: "error",
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
          <div className="page-single">
            <div className="container">
              <div className="row">
                <div className="col col-login mx-auto">
                  <div className="card">{this.props.children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
