import React, { Component } from "react";
import TemplateAutenticacao from "components/templates/autenticacao.template";

import { Link, Redirect } from "react-router-dom";
export default class LoginScreen extends Component {
  state = {
    redirect: false,
    msg: "",
    email: "",
    passwd: ""
  };
  login = event => {
    event.preventDefault();
    const requestInfo = {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.passwd
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };
    fetch("http://localhost:3001/auth/authenticate", requestInfo)
      .then(response => {
        if (response.ok) {
          return console.log(response.text())
        } else {
          throw new Error("Invalid email or password");
        }
      })
      .then(token => {
        localStorage.setItem("auth-token", token);
        this.setState({ redirect: true });
      })
      .catch(err => {
        this.setState({ msg: "Erro: usuário ou senha inválidos." });
        localStorage.removeItem("auth-token");
      });
  }
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
      return <Redirect to="/sistema/aluno" />;
    }
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={this.login}>
          <div className="card-body p-6">
            <div style={{ textAlign: "center" }}>
              <img
                className="h-9"
                alt="Logo sistema"
                src="/assets/images/logo.png"
              />
            </div>
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
