import React, { Component } from "react";
import { Redirect ,Link} from 'react-router-dom';

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardBody from "components/ui/card/cardBody.component";
import NavPagination from "components/ui/navs/navPagination";
import api from '../../../services/api'

const card = {
    maxHeight: "250px",
    minHeight: "250px"
}

const botaoV = {
    float: "right",
}

const botao = {
    width: "100%"
}

const estilo = {
    paddingBottom: "25%"
}

export default class TurmasScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            items: [],
            loadingTurmas:false,
            contentInputSeach:'',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            perfil: localStorage.getItem("user.profile")
        }
        this.handlePage = this.handlePage.bind(this)
    }

    componentDidMount() {
        this.getMinhasTurmas();
    }

    async getMinhasTurmas(){
        const {numPageAtual,contentInputSeach} = this.state
        console.log(contentInputSeach);
        const query = `include=${contentInputSeach}`
        try{
            this.setState({loadingTurmas:true})
            const response = await api.get(`/user/class/page/${numPageAtual}?${query}`)
            this.setState({
                items : response.data.docs,
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingTurmas:false,
            })
        }catch(err){
            this.setState({loadingTurmas:false})
            console.log(err)
        
        }
    };
    async handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        await this.setState({numPageAtual:numPage})
        this.getMinhasTurmas()
    }

    setRedirect = () => {
        this.setState({
          redirect: true
        })
    }

    handleContentInputSeach = (e) =>{
        this.setState({contentInputSeach:e.target.value.trim()})
    }
    async clearContentInputSeach(){
        await this.setState({contentInputSeach:''})
        this.getMinhasTurmas()
    }


    render() {

        const {redirect,loadingTurmas,contentInputSeach,items,numPageAtual,totalPages,perfil} = this.state
        const range = num => {
            let arr =[]
            for(let i=0;i<num;i++) arr.push(i);
            return arr
        }
        if(perfil!=="PROFESSOR"){
            return <Redirect to="/401" />;
        }
        return (
        <TemplateSistema active='home'>
            <div className="row">
                <div className="col-3">
                    <div>
                        <Link 
                            to={'/professor/novasturmas'}
                            className="btn btn-primary"
                            type="button"
                            style={botao}
                        >
                            Nova Turma <i className="fa fa-plus-circle" />
                        </Link>
                    </div>
                </div>

                <div className="input-group mb-3 col-9">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Recipient's username" 
                        aria-label="Recipient's username" 
                        aria-describedby="button-addon2"
                        value={contentInputSeach}
                        onChange={(e) => this.handleContentInputSeach(e)}
                    />
                    <div className="input-group-append">
                        <button 
                            type="button" 
                            className='btn btn-secondary btn-outline-secondary'
                            id="button-addon2"
                            onClick={()=> this.getMinhasTurmas()}
                        >
                            <i className="fe fe-search" />
                        </button>
                        <button 
                            className='btn btn-secondary btn-outline-secondary'
                            type="button" 
                            id="button-addon2"
                            onClick={()=> this.clearContentInputSeach()}
                        >
                            <i className="fe fe-rotate-cw" />
                        </button>
                    </div>
                </div>

                {loadingTurmas?
                    range(8).map((i) => (
                        <div key={i} className="col-6">
                            <br></br>
                            <Card>
                                <CardHead></CardHead>
                                <CardBody otherClasses='text-center'>
                                    <div className="loader" style={{margin:'0px auto'}}></div>
                                </CardBody>
                            </Card>
                        </div>
                    ))
                :
                    items.map((turma, index) => (
                        <div key={index} className="col-6">
                            <br></br>
                            <Card>
                                <CardHead>
                                    <i className="fa fa-users" /> {turma.name} - {turma.year}.{turma.semester || 1}
                                </CardHead>
                                <CardBody>
                                    <Link to={`/professor/turma/${turma._id}/editar`} style={botaoV} className="btn btn-success mr-2">
                                        <i className="fe fe-edit" /> Editar
                                    </Link>
                                    <Link to={`/professor/turma/${turma._id}`} style={botaoV} className="btn btn-primary mr-2">
                                        <i className="fe fe-corner-down-right" /> Entrar
                                    </Link>
                                </CardBody>
                            </Card>
                        </div>
                    ))
                }
            </div>
            <div className='row'>
                <div className='col-12 text-center'>
                    <NavPagination
                      totalPages={totalPages}
                      pageAtual={numPageAtual}
                      handlePage={this.handlePage}
                    />
                </div>
            </div>
        </TemplateSistema>
        )
    }
}