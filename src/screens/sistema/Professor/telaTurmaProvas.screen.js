import React, { Component } from "react";
import Teste from '../../../components/ui/modal/btnModal.component'

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'

import Noticias from '../../../components/ui/jumbotron/jumbotronNoticias.component' 
import SubMenu from '../../../components/menus/dashboard/professor/subMenuTurma.menu'

export default class Pagina extends Component {
    state = {
        redirect: false,
        items: [],
        perfil: localStorage.getItem("user.profile")
    };

    componentDidMount() {
    }
    
    

    render() {
        
        return (
        <TemplateSistema>
            <div>
                <Noticias/>
                <SubMenu/>
                
            </div>

        </TemplateSistema>
        )
    }
}