/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

// Referência para icones: https://preview.tabler.io/icons.html

import React, { Component } from "react";

import { Link } from "react-router-dom";
import SubMenuTurmas from './subMenuTurma.menu'
export default class MenuAluno extends Component {
  render() {
    if(this.props.submenu==='telaTurmas')
    return <SubMenuTurmas {...this.props}/>
    else
    return (
      <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg order-lg-first">
              <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link to="/aluno" className={`nav-link ${this.props.active==='home'?'active':''}`}>
                    <i className="fe fe-home" />
                    Início
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/aluno/turmasAbertas" className={`nav-link ${this.props.active==='turmasAbertas'?'active':''}`}>
                    <i className="fe fe-users" />
                    Turmas abertas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/aluno/exercicios" className={`nav-link ${this.props.active==='exercicios'?'active':''}`}>
                    <i className="fa fa-code" />
                    Exercícios
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