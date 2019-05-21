import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import { Redirect } from "react-router-dom";

import api from "../../services/api";

//import queryString from "querystring"

export default class resetScreen extends Component {
  state = {
    msg: "",
    password: "",
    confirmpassword: "",
    error: false
  };
  send = e => {
    e.preventDefault();

    if (this.state.password === "") {
      this.setState({ msg: "Informe a nova senha", error: true });
    } else if (this.state.confirmpassword === "") {
      this.setState({
        msg: "Informe a confirmação da nova senha",
        error: true
      });
    } else if (this.state.password !== this.state.confirmpassword) {
      this.setState({
        msg: "A nova senha e sua confirmação não correspondem",
        error: true
      });
    } else {
      const requestInfo = {
        password: this.state.password
      };
      api
        .post("/auth/resetpassword", requestInfo)
        .then(response => {
          if (response) {
            this.resetpasswordform.reset();
            this.setState({
              showmodal: true,
              msg: "",
              error: false
            });
            return <Redirect to="/" />;
          } else {
            throw new Error("Failed to update password");
          }
        })
        .catch(err => {
          this.setState({
            msg: "Erro: o link usado expirou ou é inválido.",
            error: true
          });
        });
    }
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };
  handleConfirmPasswordChange = e => {
    this.setState({ confirmpassword: e.target.value });
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
            <div className="card-title">Restauração de Senha</div>
            <span
              className={"alert-" + (this.state.error ? "danger" : "success")}
            >
              {this.state.msg}
            </span>
            <div className="form-group">
              <label className="form-label">Digite sua nova senha</label>
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
                value={this.state.confirmpassword}
                onChange={this.handleConfirmPasswordChange}
              />
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
                Enviar
              </button>
            </div>
          </div>
        </form>
        <br />
      </TemplateAutenticacao>
    );
  }
}
