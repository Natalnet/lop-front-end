import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import CriarLista from "components/ui/card/criarLista.component";

export default class HomeListasScreen extends Component {
    render() {
        return (
        <TemplateSistema>
            <CriarLista/>
        </TemplateSistema>
        )
    }
}