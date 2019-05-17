import React, { Component } from "react";

import AdministracaoTemplate from "components/templates/administracao.template";

import Insti from "components/ui/card/paginaInsti.component";

export default class HomeAdministradorScreen extends Component {
  componentDidMount() {
    document.title = "Sistema Administrativo - Plataforma LOP";
  }

  render() {
    return (
      <AdministracaoTemplate>
        <Insti />
      </AdministracaoTemplate>
    );
  }
}
