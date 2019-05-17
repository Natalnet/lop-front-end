/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

// Referência para icones: https://preview.tabler.io/icons.html

import React, { Component } from "react";

import { Link } from "react-router-dom";

export default class MenuAdministrador extends Component {
  render() {
    return (
      <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg order-lg-first">
              <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link
                    to="/sistema/administrador"
                    className="nav-link"
                    data-toggle="pill"
                    aria-selected="false"
                  >
                    <i className="fe fe-home" />
                    Início
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/sistema/administrador/usuarios"
                    className="nav-link"
                    data-toggle="pill"
                    aria-selected="false"
                  >
                    <i className="fe fe-bar-chart" />
                    Usuários
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/sistema/administrador/instituicoes"
                    className="nav-link"
                    data-toggle="pill"
                    aria-selected="false"
                  >
                    <i className="fe fe-briefcase" />
                    Instituições
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/sistema/administrador/disciplinas"
                    className="nav-link"
                    data-toggle="pill"
                    aria-selected="false"
                  >
                    <i className="fe fe-briefcase" />
                    Disciplinas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/sistema/administrador/cursos"
                    className="nav-link"
                    data-toggle="pill"
                    aria-selected="false"
                  >
                    <i className="fe fe-briefcase" />
                    Cursos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
