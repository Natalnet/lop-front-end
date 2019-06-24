import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";
import Error404 from "screens/erros/error404.screen";

import { Redirect } from "react-router-dom";

import Swal from "sweetalert2";

import api from "../../services/api";
import LogoLOP from "components/ui/logoLOP.component";

export default class resetScreen extends Component {
  state = {
    redirect: false,
    redirectLogin: false,
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

      const key = window.location.search;
      api
        .put("/auth/resetpassword" + key, requestInfo)
        .then(response => {
          if (response) {
            localStorage.setItem("auth-token", response.data.token);
            localStorage.setItem("user.profile", response.data.user.profile);
            localStorage.setItem("user.name", response.data.user.name);
            localStorage.setItem("user.email", response.data.user.email);
            localStorage.setItem(
              "user.enrollment",
              response.data.user.enrollment
            );
            Swal.fire({
              type: "success",
              title: `Congratulations`,
              text: `Senha alterada com sucesso.`,
              confirmButtonText: "Acessar o sistema"
            }).then(result => {
              if (result.value) {
                return this.setState({ redirect: true });
              }
            });
          }
        })
        .catch(err => {
          Swal.fire({
            type: "error",
            title: `Ops...`,
            text: `Erro: o link usado expirou ou é inválido.`,
            confirmButtonText: "Voltar para tela de login"
          }).then(result => {
            if (result.value) {
              return this.setState({ redirectLogin: true });
            }
          });
        });
    }
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (window.location.search.length < 45) {
      return <Error404 />;
    }
    if (this.state.redirectLogin) {
      return <Redirect to="/" />;
    }
    if (this.state.redirect) {
      return <Redirect to="/sistema/aluno" />;
    }
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={this.send}>
          <div className="card-body p-6">
            <LogoLOP />
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
                name="password"
                className="form-control"
                placeholder="****"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirme sua senha</label>
              <input
                type="password"
                name="confirmpassword"
                className="form-control"
                placeholder="****"
                value={this.state.confirmpassword}
                onChange={this.handleChange}
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
