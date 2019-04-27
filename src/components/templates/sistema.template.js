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
                <div className="d-flex">
                  <a className="header-brand" href="./index.html">
                    {/* <img
                      src="/demo/brand/tabler.svg"
                      className="header-brand-img"
                      alt="LOP"
                    /> */}
                  </a>
                  <div className="d-flex order-lg-2 ml-auto">
                    <div className="dropdown d-none d-md-flex">
                      <a className="nav-link icon" data-toggle="dropdown">
                        <i className="fe fe-bell" />
                        <span className="nav-unread" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <a href="#" className="dropdown-item d-flex">
                          <span
                            className="avatar mr-3 align-self-center"
                            style={{backgroundImage:"url(demo/faces/male/41.jpg)"}}
                          />
                          <div>
                            <strong>Nathan</strong> pushed new commit: Fix page
                            load performance issue.
                            <div className="small text-muted">10 minutes ago</div>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item d-flex">
                          <span
                            className="avatar mr-3 align-self-center"
                            style={{backgroundImage:"url(demo/faces/female/1.jpg)"}}
                          />
                          <div>
                            <strong>Alice</strong> started new task: Tabler UI
                            design.
                            <div className="small text-muted">1 hour ago</div>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item d-flex">
                          <span
                            className="avatar mr-3 align-self-center"
                            style={{backgroundImage:"url(demo/faces/female/18.jpg)"}}
                          />
                          <div>
                            <strong>Rose</strong> deployed new version of NodeJS
                            REST Api V3
                            <div className="small text-muted">2 hours ago</div>
                          </div>
                        </a>
                        <div className="dropdown-divider" />
                        <a
                          href="#"
                          className="dropdown-item text-center text-muted-dark"
                        >
                          Mark all as read
                        </a>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a
                        href="#"
                        className="nav-link pr-0 leading-none"
                        data-toggle="dropdown"
                      >
                        <span
                          className="avatar"
                          style={{backgroundImage:"url(demo/faces/female/25.jpg)"}}
                        />
                        <span className="ml-2 d-none d-lg-block">
                          <span className="text-default">Jane Pearson</span>
                          <small className="text-muted d-block mt-1">
                            Administrator
                          </small>
                        </span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <a className="dropdown-item" href="#">
                          <i className="dropdown-icon fe fe-user" /> Profile
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="dropdown-icon fe fe-settings" /> Settings
                        </a>
                        <a className="dropdown-item" href="#">
                          <span className="float-right">
                            <span className="badge badge-primary">6</span>
                          </span>
                          <i className="dropdown-icon fe fe-mail" /> Inbox
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="dropdown-icon fe fe-send" /> Message
                        </a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href="#">
                          <i className="dropdown-icon fe fe-help-circle" /> Need
                          help?
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="dropdown-icon fe fe-log-out" /> Sign out
                        </a>
                      </div>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="header-toggler d-lg-none ml-3 ml-lg-0"
                    data-toggle="collapse"
                    data-target="#headerMenuCollapse"
                  >
                    <span className="header-toggler-icon" />
                  </a>
                </div>
              </div>
            </div>
            <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-3 ml-auto">
                    <form className="input-icon my-3 my-lg-0">
                      <input
                        type="search"
                        className="form-control header-search"
                        placeholder="Search&hellip;"
                        tabindex="1"
                      />
                      <div className="input-icon-addon">
                        <i className="fe fe-search" />
                      </div>
                    </form>
                  </div>
                  <div className="col-lg order-lg-first">
                    <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                      <li className="nav-item">
                        <a href="./index.html" className="nav-link">
                          <i className="fe fe-home" /> Home
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="javascript:void(0)"
                          className="nav-link"
                          data-toggle="dropdown"
                        >
                          <i className="fe fe-box" /> Interface
                        </a>
                        <div className="dropdown-menu dropdown-menu-arrow">
                          <a href="./cards.html" className="dropdown-item ">
                            Cards design
                          </a>
                          <a href="./charts.html" className="dropdown-item ">
                            Charts
                          </a>
                          <a href="./pricing-cards.html" className="dropdown-item ">
                            Pricing cards
                          </a>
                        </div>
                      </li>
                      <li className="nav-item dropdown">
                        <a
                          href="javascript:void(0)"
                          className="nav-link"
                          data-toggle="dropdown"
                        >
                          <i className="fe fe-calendar" /> Components
                        </a>
                        <div className="dropdown-menu dropdown-menu-arrow">
                          <a href="./maps.html" className="dropdown-item ">
                            Maps
                          </a>
                          <a href="./icons.html" className="dropdown-item ">
                            Icons
                          </a>
                          <a href="./store.html" className="dropdown-item ">
                            Store
                          </a>
                          <a href="./blog.html" className="dropdown-item ">
                            Blog
                          </a>
                          <a href="./carousel.html" className="dropdown-item ">
                            Carousel
                          </a>
                        </div>
                      </li>
                      <li className="nav-item dropdown">
                        <a
                          href="javascript:void(0)"
                          className="nav-link active"
                          data-toggle="dropdown"
                        >
                          <i className="fe fe-file" /> Pages
                        </a>
                        <div className="dropdown-menu dropdown-menu-arrow">
                          <a href="./profile.html" className="dropdown-item ">
                            Profile
                          </a>
                          <a href="./login.html" className="dropdown-item ">
                            Login
                          </a>
                          <a href="./register.html" className="dropdown-item ">
                            Register
                          </a>
                          <a
                            href="./forgot-password.html"
                            className="dropdown-item "
                          >
                            Forgot password
                          </a>
                          <a href="./400.html" className="dropdown-item ">
                            400 error
                          </a>
                          <a href="./401.html" className="dropdown-item ">
                            401 error
                          </a>
                          <a href="./403.html" className="dropdown-item ">
                            403 error
                          </a>
                          <a href="./404.html" className="dropdown-item ">
                            404 error
                          </a>
                          <a href="./500.html" className="dropdown-item ">
                            500 error
                          </a>
                          <a href="./503.html" className="dropdown-item ">
                            503 error
                          </a>
                          <a href="./email.html" className="dropdown-item ">
                            Email
                          </a>
                          <a href="./empty.html" className="dropdown-item active">
                            Empty page
                          </a>
                          <a href="./rtl.html" className="dropdown-item ">
                            RTL mode
                          </a>
                        </div>
                      </li>
                      <li className="nav-item dropdown">
                        <a href="./form-elements.html" className="nav-link">
                          <i className="fe fe-check-square" /> Forms
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./gallery.html" className="nav-link">
                          <i className="fe fe-image" /> Gallery
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./docs/index.html" className="nav-link">
                          <i className="fe fe-file-text" /> Documentation
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-3 my-md-5" />
          </div>
          <div className="footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-6 col-md-3">
                      <ul className="list-unstyled mb-0">
                        <li>
                          <a href="#">First link</a>
                        </li>
                        <li>
                          <a href="#">Second link</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-6 col-md-3">
                      <ul className="list-unstyled mb-0">
                        <li>
                          <a href="#">Third link</a>
                        </li>
                        <li>
                          <a href="#">Fourth link</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-6 col-md-3">
                      <ul className="list-unstyled mb-0">
                        <li>
                          <a href="#">Fifth link</a>
                        </li>
                        <li>
                          <a href="#">Sixth link</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-6 col-md-3">
                      <ul className="list-unstyled mb-0">
                        <li>
                          <a href="#">Other link</a>
                        </li>
                        <li>
                          <a href="#">Last link</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-4 mt-lg-0">
                  Premium and Open Source dashboard template with responsive and
                  high quality UI. For Free!
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="container">
              <div className="row align-items-center flex-row-reverse">
                <div className="col-auto ml-lg-auto">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <ul className="list-inline list-inline-dots mb-0">
                        <li className="list-inline-item">
                          <a href="./docs/index.html">Documentation</a>
                        </li>
                        <li className="list-inline-item">
                          <a href="./faq.html">FAQ</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-auto">
                      <a
                        href="https://github.com/tabler/tabler"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Source code
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-auto mt-3 mt-lg-0 text-center">
                  Copyright © 2018 <a href=".">Tabler</a>. Theme by{" "}
                  <a href="https://codecalm.net" target="_blank">
                    codecalm.net
                  </a>{" "}
                  All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    );
  }
}
