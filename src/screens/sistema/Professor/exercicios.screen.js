import React, { Component } from "react";
import { Link } from "react-router-dom";

import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import {Redirect} from 'react-router-dom'
import api from '../../../services/api'
import formataData from "../../../util/funçoesAuxiliares/formataData";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import HTMLFormat from 'components/ui/htmlFormat'
import {BlockMath } from 'react-katex';
import TableIO from 'components/ui/tables/tableIO.component'
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

export default class HomeExerciciosScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            exercicios: [],
            showModal:false,
            loadingExercicios:false,
            fieldFilter:'title',
            contentInputSeach:'',
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
            console.log(response.data.docs);
            this.setState({
                exercicios : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
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
        <TemplateSistema active='ecercicios'>
            <div>
                <h1 styler={titulo}>Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/professor/criarExercicio">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Exercicio +
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
                            loading={loadingExercicios}                            
                        />
                    </div>
                </div>

                 <table style={lista} className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Código</th>
                            <th>Submissões</th>
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
                                    <td>0{/*exercicio.executions.length*/}</td>
                                    <td>{exercicio.author.email}</td>
                                    <td>{formataData(exercicio.createdAt)}</td>
                                    <td>
                                        <button className="btn btn-primary mr-2" onClick={()=>this.handleShowModalInfo(exercicio)}>
                                            <i className="fa fa-info"/>
                                        </button>
                                        <Link to={`/professor/exercicios/${exercicio.id}/editar`} className="btn btn-success mr-2">
                                            <i className="fe fe-edit" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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
                    <b>Descrição: </b> <br/>
                    {question.description}
                    <BlockMath>{question.katexDescription|| ''}</BlockMath>
                    <br/>
                    <div className="row">
                        <div className ="col-12">
                          <TableIO
                            results={question.results || []}
                          />
                        </div>
                    </div>
                </CardBody>
            </Card>
            </SwalModal>
        </TemplateSistema>
        )
    }
}