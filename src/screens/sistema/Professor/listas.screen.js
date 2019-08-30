import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import ListaExercicios from "components/ui/card/listaExercicios.component";

export default class HomeListasScreen extends Component {
    render() {
        return (
        <TemplateSistema>
            <ListaExercicios/>
        </TemplateSistema>
        )
    }
}