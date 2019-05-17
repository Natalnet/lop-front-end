/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

import {Link} from 'react-router-dom';

export default class HeadPefilMenu extends Component {
  render() {
    return (
      <div className="d-flex">
        <a className="header-brand" href="/dashboard">
          <img
            src="/assets/images/lop.svg"
            className="header-brand-img"
            alt="lop logo"
          />
        </a>
        <div className="d-flex order-lg-2 ml-auto">
          <div className="dropdown">
            <Link
              to="#"
              className="nav-link pr-2 leading-none"
              data-toggle="dropdown"
            >
              <span
                className="avatar"
                style={{
                  backgroundImage:
                    "url(https://avatars1.githubusercontent.com/u/32372238?s=460&v=4)"
                }}
              />
              <span className="ml-2 d-none d-lg-block">
                <span className="text-default">Victor Hermes Alves de Souza</span>
                <small className="text-muted d-block mt-1">
                  Aluno - 20180125640
                </small>
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
              <Link className="dropdown-item" to="#">
                <i className="dropdown-icon fe fe-user" /> Perfil
              </Link>
              <div className="dropdown-divider" />
              <Link className="dropdown-item" to="/dashboard/sair">
                <i className="dropdown-icon fe fe-log-out" /> Sair
              </Link>
            </div>
          </div>
        </div>
        <Link
          to="#"
          className="header-toggler d-lg-none ml-3 ml-lg-0"
          data-toggle="collapse"
          data-target="#headerMenuCollapse"
        >
          <span className="header-toggler-icon" />
        </Link>
      </div>
    );
  }
}
