import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import api from '../../../services/api'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import formataData from "../../../util/funçoesAuxiliares/formataData";
const lista = {
    backgroundColor:"white"
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
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)

    }
    componentDidMount() {
        document.title = "Exercícios";
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
        const {exercicios,fildFilter,loadingExercicios,contentInputSeach,numPageAtual,totalPages} = this.state
        return (
        <TemplateSistema active='exercicios'>
                <Row mb={15}>
                    <Col xs={12} >
                        <h3 style={{margin:'0px'}}> Listas de Exercícios</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} mb={15}>     
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
                    </Col>
                </Row>
                <Row mb={15}>
                    <Col xs={12}>
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
                                            <td>{`(${exercicio.submissions.countCorrects}/${exercicio.submissions.count})`}</td>
                                            <td>{exercicio.author.email}</td>
                                            <td>{formataData(exercicio.createdAt)}</td>
                                            <td>
                                                <Link to={`/aluno/exercicio/${exercicio.id}`} className="btn btn-success mr-2">
                                                    Acessar <i className="fa fa-wpexplorer" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} textCenter>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </Col>
                </Row>
        </TemplateSistema>
        )
    }
}