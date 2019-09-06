import React, { Component } from "react";
import TemplateAutenticacao from "components/templates/autenticacao.template";

import api from "../../services/api";

import { Link, Redirect } from "react-router-dom";
import LogoLOP from "components/ui/logoLOP.component";

export default class LoginScreen extends Component {
  state = {
    redirect: false,
    msg: "",
    email: "",
    passwd: "",
    profile: "ALUNO"
  };
  login = event => {
    event.preventDefault();
    const requestInfo = {
      email: this.state.email,
      password: this.state.passwd
    };
    api
      .post("/auth/authenticate", requestInfo)
      .then(response => {
        if (response) {
          localStorage.setItem("auth-token", response.data.token);
          localStorage.setItem("user.profile", response.data.user.profile);
          localStorage.setItem("user.name", response.data.user.name);
          localStorage.setItem("user.email", response.data.user.email);
          localStorage.setItem("user.enrollment", response.data.user.enrollment);
          this.setState({ redirect: true, profile: response.data.user.profile });;
        }else{
          throw new Error("Invalid email or password");
        }
      })
  };
  componentDidMount() {
    document.title = "Realizar login - Plataforma LOP";
  }
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ passwd: e.target.value });
  };
  render() {
    if (this.state.redirect) {
      if (this.state.profile === "ALUNO") {
        return <Redirect to="/sistema/aluno" />;
      } else if (this.state.profile === "PROFESSOR") {
        return <Redirect to="/professor/turmas" />;
      } else if (this.state.profile === "ADMINISTRADOR") {
        return <Redirect to="/sistema/administrador/usuarios" />;
      }
    }
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={this.login}>
          <div className="card-body p-6">
            <LogoLOP/>
            <div className="card-title">Faça login na sua conta</div>
            <div className="form-group">
              <span className="alert-danger">{this.state.msg}</span>
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
              <label className="form-label">
                Senha
                <Link
                  to="/autenticacao/recuperar-senha"
                  className="float-right small"
                >
                  Esqueci a senha
                </Link>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={this.state.passwd}
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" />
                <span className="custom-control-label">Lembrar-me</span>
              </label>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
                Entrar
              </button>
            </div>
          </div>
        </form>
        <div className="text-center text-muted">
          Não tem conta? <Link to="/autenticacao/cadastro"> cadastre-se</Link>
        </div>
        <br />
      </TemplateAutenticacao>
    );
  }
}
