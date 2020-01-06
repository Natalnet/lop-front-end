import { Component } from "react";

import Swal from "sweetalert2";

import api from "../../services/api";

export default class ConfirmRegister extends Component {

  
  componentDidMount() {
    document.title = "Confirmar cadastro - Plataforma LOP";
    this.confirmarRegistro();
  }
  async confirmarRegistro(){
    const key = window.location.search;
    try{
      Swal.fire({
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.post("/auth/confirm_register" + key)
      sessionStorage.setItem("auth-token", response.data.token);
      sessionStorage.setItem("user.id", response.data.user.id);
      sessionStorage.setItem("user.profile", response.data.user.profile);
      sessionStorage.setItem("user.name", response.data.user.name);
      sessionStorage.setItem("user.email", response.data.user.email);
      Swal.fire({
        type: "success",
        title: `Seja bem vindo(a)`,
        text: `Seu email foi confirmado com sucesso, uso da plataforma já disponivel.`,
      })
      this.props.history.push(`/${sessionStorage.getItem("user.profile").toLocaleLowerCase()}`)
    }
    catch(err){
        Swal.fire({
          type: "error",
          title: `Ops...`,
          text: `Erro: o link usado expirou ou é inválido.`,
          confirmButtonText: "Voltar para tela de login",
          allowOutsideClick:false,
          allowEscapeKey:false,
          allowEnterKey:false 
        }).then(result => {
          if (result.value) {
            this.props.history.push(`/`)
          }
        })
      }
  };
  render() {
    return null;
  }
}
