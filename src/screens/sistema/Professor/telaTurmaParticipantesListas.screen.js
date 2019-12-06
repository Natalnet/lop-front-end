import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import {ProgressBar} from 'react-bootstrap'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default class Listas extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            listas: [],
            provas: [],
            user:{},
            loandingListas:true,
            loadingInfoTurma:true,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            
        };
    }
    async componentDidMount() {
        this.getListas()
        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - listas`;
    }
     async getInfoTurma(){
        const id = this.props.match.params.id
        const {turma} = this.state
        if(!turma || (turma && turma.id!==id)){
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
    async getListas(){
        try{
            const id = this.props.match.params.id
            const idUser = this.props.match.params.idUser
            const response = await api.get(`/class/${id}/participants/${idUser}`)
            console.log('listas');
            console.log(response.data);
            this.setState({
                listas:[...response.data.lists],
                provas:[...response.data.tests],
                usuario:response.data.user,
                loandingListas:false
            })

        }catch(err){
            this.setState({loandingListas:false})
            console.log(err)
        
        }
    }

    render() {
        const {loadingInfoTurma,turma,loandingListas,listas,provas,usuario} = this.state
        return (
        <TemplateSistema {...this.props} active={'participantes'} submenu={'telaTurmas'}>
            <Fragment>
                <Row mb={15}>
                        {loadingInfoTurma || loandingListas?
                            
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                        :
                        <Fragment>
                        <Col xs={6}>
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>

                        </Col>
                        <Col xs={6} textRight>
                            <h4 style={{margin:'0px'}}> {usuario.name} - {usuario.enrollment}</h4>
                        </Col>
                        </Fragment>
                        }
                    
                </Row>

                <Row mb={15}>
                  <Col xs={12}>
                    <Link to={`/professor/turma/${this.props.match.params.id}/participantes`}>
                      <button className="btn btn-success mr-2">
                        <i className="fa fa-arrow-left" /> Voltar aos participantes
                        
                      </button>
                    </Link>
                  </Col>
                </Row>
            
                    {loandingListas
                    ?
                        <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <Fragment>
                    <Row mb={10}>
                        <Col md={12} textCenter>
                            <h4 style={{margin:'0px'}}>Listas</h4>
                        </Col>
                    </Row>
                    <Row mb={15}>
                        {listas.map((lista,i)=>{
                            const questions = lista.questions
                            const questionsCompleted = lista.questions.filter(q=>q.completed)
                            const completed = (questionsCompleted.length/questions.length*100).toFixed(2)
                            return(
                            <Fragment key={lista.id}>
                            <Col xs={12}>
                            <Card key={lista.id} style={{margin:'2px'}}>
                                <CardHead>
                                    <Col xs={5}>
                                        <h4 style={{margin:'0px'}}><b>{lista.title}</b></h4>
                                    </Col>
                                    <ProgressBar now={completed} label={`${completed}%`} style={{width:'45%'}} />
                                    
                                    <CardOptions>
                                        <Link to={`/professor/turma/${this.props.match.params.id}/participantes/${usuario.id}/listas/${lista.id}/exercicios`}>
                                            <button className="btn btn-success">
                                                Acessar <i className="fa fa-wpexplorer" />
                                            </button>
                                        </Link>
                                    </CardOptions>
                                </CardHead>
                            </Card>
                            </Col>
                            </Fragment>
                            )
                        })}
                    </Row>
                    <Row mb={10}>
                        <Col md={12} textCenter>
                            <h4 style={{margin:'0px'}}>Provas</h4>
                        </Col>
                    </Row>
                    <Row mb={15}>
                        {provas.map((prova,i)=>{
                            const questions = prova.questions
                            const questionsCompleted = prova.questions.filter(q=>q.completed)
                            const completed = (questionsCompleted.length/questions.length*100).toFixed(2)
                            return(
                            <Fragment key={prova.id}>
                            <Col xs={12}>
                            <Card key={prova.id} style={{margin:'2px'}}>
                                <CardHead>
                                    <Col xs={5}>
                                        <h4 style={{margin:'0px'}}><b>{prova.title}</b></h4>
                                    </Col>
                                    <ProgressBar now={completed} label={`${completed}%`} style={{width:'45%'}} />
                                    
                                    <CardOptions>
                                        <Link to={`/professor/turma/${this.props.match.params.id}/participantes/${usuario.id}/provas/${prova.id}/exercicios`}>
                                            <button className="btn btn-success">
                                                Acessar <i className="fa fa-wpexplorer" />
                                            </button>
                                        </Link>
                                    </CardOptions>
                                </CardHead>
                            </Card>
                            </Col>
                            </Fragment>
                            )
                        })}
                    </Row>
                    </Fragment>
                    }
                    
            </Fragment>  
        </TemplateSistema>
        )
    }
}