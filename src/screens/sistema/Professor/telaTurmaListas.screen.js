import React, { Component } from "react";
import Teste from '../../../components/ui/modal/btnModal.component'

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'

import Noticias from '../../../components/ui/jumbotron/jumbotronNoticias.component' 
import SubMenu from '../../../components/menus/dashboard/professor/subMenuTurma.menu'

export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            items: [],
            loadingInfoTurma:true,
            turma:'',
            //perfil: localStorage.getItem("user.profile")
        };
    }

    componentDidMount() {
        this.getInfoTurma()
        this.getListas()        
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        try{
            const response = await api.get(`/class/${id}`)
            this.setState({
                turma:response.data,
                loadingInfoTurma:false,
            })
        }
        catch(err){
            this.setState({loadingInfoTurma:false})
            console.log(err);
        }
    }
    async getListas(){
        try{
            const id = this.props.match.params.id
            const response = await api.get(`/class/${id}/lists`)
            console.log(response.data);

            this.setState({items:response.data})

        }catch(err){
            console.log(err)
        
        }
    };
    
    render() {
        const {loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
            <div>
               {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/>  {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
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