import React, { Component } from "react";
import { Redirect ,Link} from 'react-router-dom';
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
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
            fildFilter:'name',
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
        const query = `include=${contentInputSeach}`
        try{
            this.setState({loadingTurmas:true})
            const response = await api.get(`/user/class/page/${numPageAtual}?${query}`)
            console.log(response)
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
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getMinhasTurmas())
    }

    setRedirect = () => {
        this.setState({
          redirect: true
        })
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        },()=>this.getMinhasTurmas())
        
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        },()=>this.getMinhasTurmas())
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getMinhasTurmas())
        
    }


    render() {

        const {redirect,fildFilter,loadingTurmas,contentInputSeach,items,numPageAtual,totalPages,perfil} = this.state
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

                <div className="col-9">
                    <InputGroupo
                        placeholder={'pesquiese pelo campo selecionado...'}
                        value={contentInputSeach}
                        handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                        handleSelect={this.handleSelectfildFilter.bind(this)}
                        options={ [{value:'name',content:'Nome'}] }
                        clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                        loading={loadingTurmas}                            
                    />
                </div>

                {loadingTurmas?
                    range(8).map((i) => (
                        <div key={i} className="col-6">
                            <Card>
                                <CardBody>
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
                                    <h3 className="card-title">
                                        <i className="fa fa-users" /> {turma.name} - {turma.year}.{turma.semester || 1}
                                    </h3>
                                    {/*<div className="card-options">
                                      <label className="custom-switch m-0">
                                        <input type="checkbox" value="1" className="custom-switch-input" checked/>
                                        <span className="custom-switch-indicator"></span>
                                      </label>
                                    </div>*/}
                                </CardHead>
                                <CardBody>
                                    <span title={`${turma.students.length} participante(s)`} className="avatar avatar-cyan mr-1">
                                        {turma.students.length}
                                    </span>
                                    <span title={`${0} aluno(s) online`} className="avatar avatar-teal mr-1">
                                        0
                                    </span>
                                    <span title={`${turma.requestingUsers.length} solicitação(ões)`} className="avatar avatar-red mr-1">
                                        {turma.requestingUsers.length}
                                    </span>
                                </CardBody>
                                    <CardFooter>
                                        <Link to={`/professor/turma/${turma._id}/editar`} style={botaoV} className="btn btn-success mr-2">
                                            <i className="fa fa-edit" /> Editar
                                        </Link>
                                        <Link to={`/professor/turma/${turma._id}`} style={botaoV} className="btn btn-primary mr-2">
                                            <i className="fe fe-corner-down-right" /> Entrar
                                        </Link>
                                    </CardFooter>
                                
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