import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

export default class Listas extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            lista:null,
            loandingLista:true,
            loadingInfoTurma:true,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            todasListas: [],
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
    async getListas(){
        try{
            const idLista = this.props.match.params.idLista
            const response = await api.get(`/listQuestion/${idLista}`)
            console.log('listas');
            console.log(response.data);
            this.setState({
                lista:response.data,
                loandingLista:false
            })

        }catch(err){
            this.setState({loandingLista:false})
            console.log(err)
        
        }
    };
    render() {
        
        const {loadingInfoTurma,turma,loandingLista,lista} = this.state
        const questionsCompleted = lista && lista.questions.filter(q=>q.completed)
        const completed = lista && (questionsCompleted.length/lista.questions.length*100).toFixed(2)
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                        }
                    </div>
                </div>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                    {loandingLista
                    ?
                        <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                        <Card>
                            <CardHead>
                                <div className="col-4">
                                    <h4 style={{margin:'0px'}}><b>{lista.title}</b></h4>
                                </div>
                                <div className="progress col-8" style={{height: "20px"}}>
                                    <div className="progress-bar" role="progressbar" style={{width: `${completed}%`}} aria-valuenow={completed} aria-valuemin="0" aria-valuemax="100">{completed}%</div>
                                </div>
                            </CardHead>
                            <CardBody>
                                {lista.questions.map((question,j)=>
                                <div key={question.id} className="col-12 col-md-6" style={{display: "inline-block"}}>
                                <Card >
                                        <CardHead>
                                        <CardTitle>

                                            <b>
                                            {question.title}&nbsp;
                                            {question.completed?
                                                <i className="fa fa-check" style={{color:'#0f0'}}/>
                                            :null}
                                            </b>
                                        </CardTitle>
                                        <CardOptions>
                                            <i
                                            title='Ver descrição'
                                            style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                                            className={`fe fe-chevron-down`} 
                                            data-toggle="collapse" data-target={'#collapse2'+j+lista.id} 
                                            aria-expanded={false}
                                            />
                                        </CardOptions>
                                        </CardHead>
                                        <div className="collapse" id={'collapse2'+j+lista.id}>
                                            <CardBody>
                                                {question.description}
                                           </CardBody>
                                        </div>
                                        <CardFooter>

                                            <span className="avatar avatar-cyan" title={`Você submeteu essa questão ${question.submission?question.submission.numSubmissions:0} vez(es)`}>
                                                {question.submissions.length}
                                            </span>
                                            <Link to={`/aluno/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}`} className="btn btn-success mr-2" style={{float:"right"}}>
                                                    Acessar <i className="fa fa-wpexplorer" />
                                            </Link>
                                        </CardFooter>
                                </Card>
                                </div>
                                )}
                            </CardBody>
                        </Card>
                    }
                    </div>
                </div>
        </TemplateSistema>
        )
    }
}