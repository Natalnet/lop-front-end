import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'

export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            loadingInfoTurma:true,
        }
        
    }

    componentDidMount() {
        this.getInfoTurma()
    }
     async getInfoTurma(){
        const id = this.props.match.params.id
        const {turma} = this.state
        if(!turma || (turma && turma.id!==id)){
            console.log('dentro do if');
            try{
                const response = await api.get(`/class/${id}`)
                const turmaData = {
                    id:response.data.id,
                    name:response.data.name,
                    year:response.data.year,
                    semester:response.data.semester,
                    languages:response.data.languages
                }
                this.setState({
                    turma:turmaData,
                    loadingInfoTurma:false,
                })
                sessionStorage.setItem('turma',JSON.stringify(turmaData))
            }
            catch(err){
                this.setState({loadingInfoTurma:false})
                console.log(err);
            }
        }
        else{
            this.setState({loadingInfoTurma:false})
        }
    }    
    render() {
        const {loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema {...this.props} active={'provas'} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                        }
                    </div>
                </div>

        </TemplateSistema>
        )
    }
}