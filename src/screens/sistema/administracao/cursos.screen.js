import React, { Component } from "react";

import AdministracaoTemplate from "components/templates/administracao.template";

import Cursos from "components/ui/card/paginaCursos.component";

export default class HomeAdministradorScreen extends Component {
    componentDidMount() {
      document.title = "Sistema Administrativo - Plataforma LOP";
    }
  
    render() {
      return (
        <AdministracaoTemplate>
          <Cursos/>
        </AdministracaoTemplate>
      );
    }
  }