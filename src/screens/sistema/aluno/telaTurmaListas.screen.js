import React, { Component } from "react";
import Teste from '../../../components/ui/modal/btnModal.component'

import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Swal from 'sweetalert2'
import BtnModal from 'components/ui/modal/btnModal.component'
import BotaoModal from "components/ui/modal/btnModalLista.component"
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            listas: [],
            loandingListas:true,
            loadingInfoTurma:true,
            turma:'',
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
            this.setState({
                listas:[...response.data],
                loandingListas:false
            })

        }catch(err){
            this.setState({loandingListas:false})
            console.log(err)
        
        }
    };
    render() {
        
        const {loadingInfoTurma,turma,loandingListas,listas} = this.state
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
            <div>
               {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/>  {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
                
                {loandingListas
                ?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                :
                <div className="col-12">
                    {listas.map((lista,i)=>
                    <Card key={i}>
                        <CardHead>
                                    <div className="col-4">
                                        {lista.title}
                                    </div>
                                    <div className="progress col-8" style={{height: "20px"}}>
                                        <div className="progress-bar" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                                    </div>
                        <CardOptions>
                            <i
                            title='Ver descrição'
                            style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                            className={`fe fe-chevron-down`} 
                            data-toggle="collapse" data-target={'#collapse'+i} 
                            aria-expanded={false}
                            />
                        </CardOptions>
                        </CardHead>
                        <div className="collapse" id={'collapse'+i}>
                        <CardBody>
                            {lista.questions.map((questions,j)=>
                            <div className="col-6" style={{display: "inline-block"}}>
                            <Card key={j}>
                                    <CardHead>
                                    <CardTitle>
                                        {questions.title}
                                    </CardTitle>
                                    <CardOptions>
                                        <i
                                        title='Ver descrição'
                                        style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                                        className={`fe fe-chevron-down`} 
                                        data-toggle="collapse" data-target={'#collapse2'+j} 
                                        aria-expanded={false}
                                        />
                                    </CardOptions>
                                    </CardHead>
                                    <div className="collapse" id={'collapse2'+j}>
                                    <CardBody>
                                        {questions.description}
                                       </CardBody>
                                    </div>
                                    <CardFooter>
                                        <Link to={`/aluno/exercicio/${questions.id}`} className="btn btn-success mr-2" style={{float:"right"}}>
                                                Acessar <i className="fa fa-wpexplorer" />
                                        </Link>
                                    </CardFooter>
                            </Card>
                            </div>
                            )}
                        </CardBody>
                        </div>
                    </Card>
                    )}
                </div>
                }

            </div>

        </TemplateSistema>
        )
    }
}