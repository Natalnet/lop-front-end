import React, { Component } from "react";

import AdministracaoTemplate from "components/templates/administracao.template";

import Disciplinas from "components/ui/card/paginaDiscip.component";

export default class HomeAdministradorScreen extends Component {
    componentDidMount() {
      document.title = "Sistema Administrativo - Plataforma LOP";
    }
  
    render() {
      return (
        <AdministracaoTemplate>
          <Disciplinas/>
        </AdministracaoTemplate>
      );
    }
  }