import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";
const queryString = require("query-string");
import { Link } from "react-router-dom";
export default class resetScreen extends Component {
  state = {
    msg: "",
    password:"",
    confirmpassword:"",
    error: false
  };
  send=e=>{
    e.preventDefault();

    if (this.state.password === '' ) {
         this.setState({msg:'Informe a nova senha senha'});
    } else if (this.state.confirmpassword === '' ) {
         this.setState({msg:'Informe a confirmação da nova senha'});
    } else if (this.state.password !== this.state.confirmpassword ) {
         this.setState({msg:'A a nova senha e sua confirmação não correspondem'});
    } else {
         const requestInfo = {
              method: 'POST',
              body: JSON.stringify({
                   code: this.state.code,
                   password: password
              }),
              headers: new Headers({
                   'Content-type': 'application/json'
              })
         }

         fetch('http://localhost:3001/auth/resetpassword',requestInfo)
         .then(response => {
              if(response.ok) {
                   return response.text();
              } else {
                   throw new Error('Failed to register');
              }
         })
         .then(msg => {
              this.resetpasswordform.reset();
              this.setState({
                   showmodal : true,
                   msg:''
               });
         })
         .catch(err => {
              this.setState({msg:'Erro: o link usado expirou ou é inválido.'})
         });
    }
}
  render() {
    return <div />;
  }
}
