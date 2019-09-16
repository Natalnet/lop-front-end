import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'

import SubMenu from '../../../components/menus/dashboard/professor/subMenuTurma.menu'

export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            items: [],
            turma:'',
            loadingInfoTurma:true,
        }
        
    }

    componentDidMount() {
        this.getInfoTurma()
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        try{
            const response = await api.get(`/class/${id}`)
            console.log(response);
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
    render() {
        const {loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema {...this.props} active={'dashboard'} submenu={'telaTurmas'}>
            {loadingInfoTurma?
                <div className="loader"  style={{margin:'0px auto'}}></div>
                :
                <h3><i className="fa fa-users mr-2" aria-hidden="true"/>  {turma.name} - {turma.year}.{turma.semester || 1}</h3>
            }
            <br/>

        </TemplateSistema>
        )
    }
}