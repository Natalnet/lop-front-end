import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import Exercicios from "components/ui/card/exercicios.component";

export default class HomeListasScreen extends Component {
    render() {
        return (
        <TemplateSistema>
            <Exercicios/>
        </TemplateSistema>
        )
    }
}