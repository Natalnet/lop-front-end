/*
 * @Author: Victor Hermes
 * @Date: 2019-05-18 17:37:20
 *
 */

import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import { Link } from "react-router-dom";
// resposta do back ao enviar email na rota: autenticacao/recuperar-senha?token={token}
export default class recoverScreen extends Component {
  state = {
    email: "",
    msg: "",
    error: false
  };

  send = e => {
    e.preventDefault();

    var regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (this.state.email === "" || !regex.test(this.state.email)) {
      this.setState({ msg: "Informe um endereço de email válido" });
    } else {
      const requestInfo = {
        method: "POST",
        body: JSON.stringify({
          email: this.state.email
        }),
        headers: new Headers({
          "Content-type": "application/json"
        })
      };

      fetch("http://192.168.0.22:3001/auth/forgotpassword", requestInfo)
        .then(response => {
          if (response.ok) {
            return this.setState({
              msg: "Email enviado, por favor verificar o email",
              error: false
            });
          } else {
            throw new Error("Invalid email");
          }
        })
        .catch(err => {
          this.setState({
            msg: "Endereço de email informado não está cadastrado",
            error: true
          });
        });
    }
  };
  componentDidMount() {
    document.title = "Recuperar Senha - Plataforma LOP";
  }
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  render() {
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={this.send}>
          <div className="card-body p-6">
            <div style={{ textAlign: "center" }}>
              <img
                className="h-9"
                alt="Logo sistema"
                src="/assets/images/logo.png"
              />
            </div>
            <div className="card-title">Recuperação de senha</div>
            <div className="form-group">
              <span
                className={"alert-" + (this.state.error ? "danger" : "success")}
              >
                {this.state.msg}
              </span>
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu e-mail"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
                Enviar
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
