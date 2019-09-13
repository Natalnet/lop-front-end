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
        console.log(this.props.match.params.id)
        
    }
    async getListas(){
        try{
            const id = this.props.match.params.id
            const response = await api.get(`/class/${id}`)
            
          
            this.setState({items:[...response.data.listsQuestions,response.data.listsQuestions]})
            console.log('na tela de turmas')
            console.log(this.state.items)
        }catch(err){
            console.log(err)
        
        }
    };
    
    

    render() {
        return (
        <TemplateSistema>
            <div>
                <Noticias/>
                <SubMenu/>
                

                <div className="col-3">
                
                </div>
                <div className="col-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome:</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                   <td></td>
                                </tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-6">
                    <table>

                    </table>
                </div>
            </div>

        </TemplateSistema>
        )
    }
}