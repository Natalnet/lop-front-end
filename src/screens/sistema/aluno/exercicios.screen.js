import React, { Component } from "react";
import { Link } from "react-router-dom";

import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import {Redirect} from 'react-router-dom'
import api from '../../../services/api'
import formataData from "../../../util/funçoesAuxiliares/formataData";
const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class ExerciciosScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            exercicios: [],
            showModal:false,
            loadingExercicios:false,
            fildFilter:'title',
            contentInputSeach:'',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)

    }
    componentDidMount() {
        document.title = "Exercícios - professor";
        this.getExercicios();
    }
    async getExercicios(){
        const {numPageAtual,contentInputSeach,fildFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&fild=${fildFilter}`
        try{
            this.setState({loadingExercicios:true})
            const response = await api.get(`/question/page/${numPageAtual}?${query}`)
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


    handleShowModal(){
        this.setState({showModal:true})
    }
    handleCloseModal(){
        this.setState({showModal:false})
    }
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getExercicios())
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
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
        const {exercicios,showModal,fildFilter,loadingExercicios,contentInputSeach,numPageAtual,totalPages} = this.state
        return (
        <TemplateSistema active='exercicios'>
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
                            placeholder={`Perquise pelo ${fildFilter==='title'?'Nome':fildFilter==='code'?'Código':'...'}`}
                            value={contentInputSeach}
                            handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                            filterSeash={this.filterSeash.bind(this)}
                            handleSelect={this.handleSelectfildFilter.bind(this)}
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
                            <th>Execuções</th>
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
                                    <td>{exercicio.createdBy && exercicio.createdBy.email}</td>
                                    <td>{formataData(exercicio.createdAt)}</td>
                                    <td>
                                        <Link to={`/aluno/exercicios/${exercicio.id}`} className="btn btn-success mr-2">
                                            Acessar <i className="fa fa-wpexplorer" />
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
        </TemplateSistema>
        )
    }
}