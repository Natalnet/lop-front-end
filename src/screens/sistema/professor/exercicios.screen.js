import React, { Component } from "react";
import { Link } from "react-router-dom";

import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import api from '../../../services/api'
import formataData from "../../../util/funçoesAuxiliares/formataData";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import TableIO from 'components/ui/tables/tableIO.component'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

const lista = {
    backgroundColor:"white"
};
const botao = {
    width: "100%"
};

export default class HomeExerciciosScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            exercicios: [],
            showModalInfo:false,
            loadingExercicios:false,
            fieldFilter:'title',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            question:''
        }
        this.handlePage = this.handlePage.bind(this)

    }
    componentDidMount() {
        document.title = "Exercícios - professor";
        this.getExercicios();
    }
    async getExercicios(){
        const {numPageAtual,contentInputSeach,fieldFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&field=${fieldFilter}`
        try{
            this.setState({loadingExercicios:true})
            const response = await api.get(`/question/page/${numPageAtual}?${query}`)
            console.log('exercicios:');
            console.log(response.data);
            this.setState({
                exercicios : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                numPageAtual : response.data.currentPage,
                loadingExercicios:false
            })
        }catch(err){
            this.setState({loadingExercicios:false})
            console.log(err);
        }
    };
    handleShowModalInfo(question){
        console.log(question);
        this.setState({
            question:question,
            showModalInfo:true,
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
        },()=>this.getExercicios())
    }
    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getExercicios()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getExercicios()*/)
        
    }
    filterSeash(){
        this.getExercicios()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getExercicios())
        
    }


    render() {
        const {exercicios,showModalInfo,fieldFilter,loadingExercicios,contentInputSeach,numPageAtual,totalPages,question} = this.state
        return (
        <TemplateSistema active='exercicios'>
                <Row mb={15}>
                    <Col xs={12} >
                        <h5 style={{margin:'0px'}}> 
                            Exercícios
                        </h5> 
                    </Col>
                </Row>
                <Row mb={15}>
                    <Col xs={3} >
                        <Link to="/professor/criarExercicio">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Exercicio +
                            </button>
                        </Link>
                    </Col>           
                    <Col xs={9} >     
                        <InputGroup
                            placeholder={`Perquise pelo ${fieldFilter==='title'?'Nome':fieldFilter==='code'?'Código':'...'}`}
                            value={contentInputSeach}
                            handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                            filterSeash={this.filterSeash.bind(this)}
                            handleSelect={this.handleSelectFieldFilter.bind(this)}
                            options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                            clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                            loading={loadingExercicios}                            
                        />
                    </Col> 
                </Row>
                <Row mb={15}>
                    <Col xs={12} >
                     <table style={lista} className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Código</th>
                                <th>Submissões gerais (corretas/total)</th>
                                <th>Criado por</th>
                                <th>Criado em</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingExercicios
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
                                    <td>
                                        <div className="loader"/>
                                    </td>

                                </tr>           
                            :
                                exercicios.map((exercicio, index) => (
                                    <tr key={index}>
                                        <td>{exercicio.title}</td>
                                        <td>{exercicio.code}</td>
                                        <td>{`(${exercicio.submissionsCorrectsCount}/${exercicio.submissionsCount})`}</td>

                                        <td>{exercicio.author.email}</td>
                                        <td>{formataData(exercicio.createdAt)}</td>
                                        <td style={{display:'inline-flex'}}>
                                            <button className="btn btn-primary mr-2" onClick={()=>this.handleShowModalInfo(exercicio)}>
                                                <i className="fa fa-info"/>
                                            </button>
                                            <Link to={`/professor/exercicios/${exercicio.id}/editar`}>
                                                <button className="btn btn-success">
                                                    <i className="fe fe-edit" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </Col>
                </Row>
                <Row mb={15}>
                    <Col xs={12} textCenter>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </Col>
                </Row>
                <SwalModal
                    show={showModalInfo}
                    title="Exercício"
                    handleModal={this.handleCloseshowModalInfo.bind(this)}
                    width={'90%'}
                >
                <Card>
                    <CardHead>
                        <CardTitle>
                            {question.title}
                        </CardTitle>
                    </CardHead>
                    <CardBody>
                        <Row>
                            <b>Descrição: </b>
                        </Row>
                        <Row>
                            {question.description}
                        </Row>
                        <Row>
                            <Col xs={12} textCenter>
                                <BlockMath>{question.katexDescription|| ''}</BlockMath>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                            <TableIO
                                results={question.results || []}
                            />
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Row>
                            <Col xs={12} mb={15}>
                                <b>Autor:</b> {question && question.author.email} 
                            </Col>
                            <Col xs={12} mb={15}>
                                <b>Tags: </b> {question && question.tags.join(", ")}
                            </Col>
                            <Col xs={12}>
                                <b>Data de criação:</b> {question && formataData(question.createdAt)} 
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
                </SwalModal>
        </TemplateSistema>
        )
    }
}