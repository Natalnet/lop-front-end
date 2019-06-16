/*
 * @Author: Hemerson Rafael
 * @Date: 2019-05-03 16:35:20
 *
 */

import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import api from "../../services/api";

import { Link, Redirect } from "react-router-dom";

export default class LoginScreen extends Component {
  state = {
    redirect: false,
    name: "",
    enrollment: "",
    email: "",
    password: "",
    confirm_password: "",
    msg: ""
  };
  register = event => {
    event.preventDefault();
    var regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (this.state.name === "") {
      this.setState({ msg: "Informe seu nome completo" });
    } else if (this.state.enrollment === "") {
      this.setState({ msg: "Informe sua matrícula" });
    } else if (this.state.email === "" || !regex.test(this.state.email)) {
      this.setState({ msg: "Informe um endereço de email válido" });
    } else if (this.state.password === "") {
      this.setState({ msg: "Informe uma senha" });
    } else if (this.state.confirm_password === "") {
      this.setState({ msg: "Informe uma confirmação de senha" });
    } else if (this.state.password !== this.state.confirm_password) {
      this.setState({ msg: "A senha e confirmação de senha não correspondem" });
    } else {
      const requestInfo = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        enrollment: this.state.enrollment
      };
      api
        .post("/auth/register", requestInfo)
        .then(response => {
          if (response) {
            localStorage.setItem("user.profile", "Aluno");
            localStorage.setItem("user.name", this.state.name);
            localStorage.setItem("user.email", this.state.email);
            localStorage.setItem(
              "user.enrollment",
              this.state.enrollment
            );
            this.setState({
              msg: "",
              redirect: true
            });
          } else {
            throw new Error("Failed to register");
          }
        })
        .catch(err => {
          this.setState({ msg: "Erro: matrícula ou email indispnível" });
        });
    }
  };
  componentDidMount() {
    document.title = "Realizar Cadastro - Plataforma LOP";
  }
  handleNomeChange = e => {
    this.setState({ name: e.target.value });
  };
  handleEnrollmentChange = e => {
    this.setState({ enrollment: e.target.value });
  };
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };
  handleConfirmPasswordChange = e => {
    this.setState({ confirm_password: e.target.value });
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/sistema/aluno" />;
    }
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={this.register}>
          <div className="card-body p-6">
            <div style={{ textAlign: "center" }}>
              <img
                className="h-9"
                alt="Logo sistema"
                src="/assets/images/logo.png"
              />
            </div>
            <span className="alert-danger">{this.state.msg}</span>
            <div className="card-title">Faça o seu cadastro</div>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu nome"
                value={this.state.name}
                onChange={this.handleNomeChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Matrícula</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite sua matrícula"
                value={this.state.enrollment}
                onChange={this.handleEnrollmentChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu e-mail"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirme sua senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={this.state.confirm_password}
                onChange={this.handleConfirmPasswordChange}
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
                Cadastrar
              </button>
            </div>
          </div>
        </form>
        <div className="text-center text-muted">
          Já tem conta? <Link to="/"> Login</Link>
        </div>
        <br />
      </TemplateAutenticacao>
    );
  }
}
