import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import Swal from "sweetalert2";
import Error404 from "screens/erros/error404.screen";

import api from "../../services/api";

export default class ConfirmRegister extends Component {
  state = {
    redirect: false,
    redirectLogin: false
  };
  componentDidMount() {
    this.confirmarRegistro();
  }
  confirmarRegistro = () => {
    const key = window.location.search;

    api
      .post("/auth/confirm_register" + key)
      .then(response => {
        if (response) {
          sessionStorage.setItem("auth-token", response.data.token);
          sessionStorage.setItem("user.profile", response.data.user.profile);
          sessionStorage.setItem("user.name", response.data.user.name);
          sessionStorage.setItem("user.email", response.data.user.email);
          sessionStorage.setItem(
            "user.enrollment",
            response.data.user.enrollment
          );
          Swal.fire({
            type: "success",
            title: `Congratulations`,
            text: `Seu email foi confirmado com sucesso, uso da plataforma já disponivel.`,
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
  };
  render() {
    if (window.location.search.length < 45) {
      return <Error404 />;
    }
    if (this.state.redirect) {
      return <Redirect to="/aluno" />;
    }
    if (this.state.redirectLogin) {
      return <Redirect to="/" />;
    }
    return null;
  }
}
