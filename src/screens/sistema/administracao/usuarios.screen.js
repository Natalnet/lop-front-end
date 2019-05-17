import React, { Component } from "react";

import AdministracaoTemplate from "components/templates/administracao.template";

import Users from "components/ui/card/paginaUsers.component";

export default class HomeAdministradorScreen extends Component {
    componentDidMount() {
      document.title = "Sistema Administrativo - Plataforma LOP";
    }
  
    render() {
      return (
        <AdministracaoTemplate>
          <Users/>
        </AdministracaoTemplate>
      );
    }
  }