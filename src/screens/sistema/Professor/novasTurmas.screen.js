import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";

import NovasTurmas from "components/ui/card/novasTurmas.component";

export default class HomeAlunoScreen extends Component {
    render() {
        return (
        <TemplateSistema>
            <NovasTurmas/>
        </TemplateSistema>
        )
    }
}