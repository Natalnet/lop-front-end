import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";

import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import {Modal} from 'react-bootstrap'
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import formataData from "../../../util/funçoesAuxiliares/formataData";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class HomeListasScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            listas: [],
            questions:[],
            showModal:false,
            loadingListas:false,
            fieldFilter:'title',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            showModalInfo:false
        }
        this.handlePage = this.handlePage.bind(this)

    }

    componentDidMount() {
        document.title = "Listas - professor";
        this.getListas();
    }

    async getListas(){
        const {numPageAtual,contentInputSeach,fieldFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&field=${fieldFilter}`
        console.log(query);

        try{
            this.setState({loadingListas:true})
            const response = await api.get(`/listQuestion/page/${numPageAtual}?${query}`)
            console.log('listas');
            console.log(response.data.docs);
            this.setState({
                listas : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingListas:false
            })
        }catch(err){
            this.setState({loadingListas:false})
            console.log(err);
        }
    };
    handleShowModalInfo(questions){
        this.setState({
            showModalInfo:true,
            questions:[...questions]
        })
    }
    handleCloseshowModalInfo(e){
        this.setState({showModalInfo:false})
    }
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getListas())
    }
    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getListas()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getListas()*/)
    }
    filterSeash(){
        this.getListas()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getListas())
        
    }


    render() {
        const {listas,showModal,fieldFilter,loadingListas,contentInputSeach,numPageAtual,totalPages,showModalInfo,questions} = this.state
        return (
        <TemplateSistema active='listas'>
            <div>
                <h1 styler={titulo}>Listas de Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/professor/criarlista" className="nav-link">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Lista <i className="fe fe-file-plus" />
                            </button>
                            </Link>
                        </div>
                    </div>
                    <div className="mb-3 col-9">     
                        <InputGroup
                            placeholder={`Perquise pelo ${fieldFilter==='title'?'Nome':fieldFilter==='code'?'Código':'...'}`}
                            value={contentInputSeach}
                            handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                            filterSeash={this.filterSeash.bind(this)}
                            handleSelect={this.handleSelectFieldFilter.bind(this)}
                            options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                            clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                            loading={loadingListas}                            
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12">
                        <table style={lista} className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>Criado em</th>
                                    <th className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingListas
                                ?
                                    <tr>
                                        <td>
                                            <div className="loader" />
                                        </td>
                                        <td>                                        
                                            <div className="loader" />
                                        </td>
                                        <td>
                                            <div className="loader"/>
                                        </td>                                        
                                        <td>
                                            <div className="loader"/>
                                        </td>
                                    </tr>
                                :
                                    listas.map((lista, index) => {
                                    return (
                                    <Fragment>
                                        <tr key={index}>
                                            <td>{lista.title}</td>
                                            <td>{lista.code}</td>
                                            <td>{formataData(lista.createdAt)}</td>
                                            <td className="text-center">
                                            <button className="btn btn-primary float-right" onClick={()=>this.handleShowModalInfo(lista.questions)}>
                                                <i className="fa fa-info"/>
                                            </button>                                            
                                            </td>
                                        </tr>
                                        
                                    </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
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
            </div>

            <Modal
                show={showModalInfo} onHide={this.handleCloseshowModalInfo.bind(this)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Questões
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">            
                {questions.map((questao, index)=>(
                    <div key={index} className="col-6"> 
                        <Card style={{marginBottom: "0"}}>
                            <CardHead style={{marginBottom: "0"}}>
                                <CardTitle>
                                    {questao.title}
                                </CardTitle>
                                <CardOptions>
                                    <button
                                        className ="btn btn-primary"
                                        data-toggle="collapse" data-target={'#collapse'+questao.id}
                                        aria-expanded="example-collapse-text"
                                        style={{position: "relative"}}
                                    >
                                        <i className="fa fa-info"/>
                                    </button>
                                </CardOptions>
                            </CardHead>
                            <div className="collapse" id={'collapse'+questao.id}>
                                <CardBody>
                                <b>Descrição: </b>
                                <p>{questao.description}</p>
                                <br/>
                                <BlockMath>{questao.katexDescription|| ''}</BlockMath>
                                <br/>
                                </CardBody>
                            </div>
                        </Card>
                    </div>
                ))}
                </div>      
                
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={this.handleCloseshowModalInfo.bind(this)}>Fechar</button>
            </Modal.Footer>
            </Modal>

        </TemplateSistema>
        )
    }
}