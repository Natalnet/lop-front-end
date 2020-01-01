import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import api from '../../../services/api'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import formataData from "../../../util/funçoesAuxiliares/formataData";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import Select from 'react-select';
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

const lista = {
    backgroundColor:"white"
}

export default class ExerciciosScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            exercicios: [],
            showModalInfo:false,
            question:"",
            showModal:false,
            loadingExercicios:false,
            loadingTags:false,
            tags:[],
            showFilter:false,
            tagsSelecionadas:[],
            fildFilter:'title',
            docsPerPage:15,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)

    }
    componentDidMount() {
        document.title = "Exercícios";
        this.getExercicios();
        this.getTags();
    }
    async getExercicios(){
        const {numPageAtual,contentInputSeach,fildFilter,docsPerPage} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query +=`&docsPerPage=${docsPerPage}`
        query += `&fild=${fildFilter}`
        try{
            this.setState({loadingExercicios:true})
            const response = await api.get(`/question/page/${numPageAtual}?${query}`)
            console.log('exercicios',response.data)
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
    async getTags(){
        try{
          this.setState({loadingTags:true})
          const response = await api.get('/tag')
          this.setState({
            tags: response.data.map(tag=>{
              return {
                value: tag.id,
                label: tag.name
              }
            }),
            loadingTags:false
          })
        }
        catch(err){
          console.log(err);
          this.setState({loadingTags:false})
        }
      }
    async handleTagsChangeTags(tags){
        console.log(tags);
        this.setState({
            tagsSelecionadas:tags || []
        })
    }
    handleShowfilter(){
        const {showFilter} = this.state
        this.setState({showFilter:!showFilter})
    }
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

    render() {
        const {exercicios,fildFilter,loadingExercicios,contentInputSeach,numPageAtual,totalPages,showFilter,showModalInfo,question,docsPerPage,tags,loadingTags} = this.state
        return (
        <TemplateSistema active='exercicios'>
                <Row mb={15}>
                    <Col xs={12} >
                    <h5 style={{margin:'0px'}}> 
                        Exercícios
                    </h5> 
                    </Col>
                </Row>
                {/*<Row>
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
                </Row>*/}
                <Card>
                    <CardHead onClick={this.handleShowfilter.bind(this)} style={{cursor:"pointer"}}>
                        <CardTitle center>
                            {showFilter?'Ocultar ':'Exibir '} filtro &nbsp;
                             <i 
                                className="fa fa-chevron-down"
                                style={{color:"#00f"}}
                            />
                        </CardTitle>
                    </CardHead>
                        {showFilter
                        ?
                        <CardBody>
                        <div className="form-row">
                            <div className="form-group col-12 col-md-6 col-lg-7">
                                <label htmlFor="nome">{`${fildFilter==='title'?'Título da ':fildFilter==='code'?'Código':'...'} da questão`} </label>
                                <div className="input-group">
                                    <input
                                        id="nome"
                                        type="text" 
                                        className="form-control" 
                                        placeholder={`Perquise pelo ${fildFilter==='title'?'Título':fildFilter==='code'?'Código':'...'} da questão`}
                                        aria-label="Recipient's username" 
                                        aria-describedby="button-addon2"
                                        value={contentInputSeach}
                                        onChange={(e) => this.handleContentInputSeach(e)}
                                    />
                                    <div className="selectgroup" >
                                        <select style={{cursor:"pointer"}} defaultValue={fildFilter} onChange={(e)=>this.handleSelectfildFilter(e)} className="selectize-input items has-options full has-items form-control">
                                            <option value={'title'}>Título</option>
                                            <option value={'code'}>Código</option>
                                        </select>     
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-12 col-md-6 col-lg-3">
                                <label htmlFor="ordem">Ordenar por:</label>
                                <div className="selectgroup" >
                                    <select id={"ordem"} className="form-control" style={{cursor:"pointer"}}>
                                        <option value={'createdAt'}>Data de criação</option>
                                        <option value={'alpha'}>Ordem alfabetica</option>
                                        <option value={'isCorrect'}>Resolvidas por mim</option>
                                        <option value={'accessCount'}>N° de acessos</option>
                                        <option value={'submissionsCount'}>N° de Submissões</option>
                                        <option value={'submissionsCorrectsCount'}>N° de Submissões corretas</option>
                                    </select>
                                    <label className="selectgroup-item">
                                        <input type="radio" 
                                            name="transportation" 
                                            value="2" 
                                            className="selectgroup-input"
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-sort-amount-desc"/>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input type="radio" 
                                            name="transportation" 
                                            value="1" 
                                            className="selectgroup-input"
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-sort-amount-asc"/>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group  col-4 col-lg-2">
                                <label htmlFor="pag">N° de ítems por página:</label>
                                <select id="pag" defaultValue={docsPerPage} className="form-control">
                                    <option value={15}>15</option>
                                    <option value={25}>25</option>
                                    <option value={40}>40</option>
                                    <option value={60}>60</option>
                                </select>
                            </div>
                            <div className="form-group  col-12">
                                <label>Tags </label>
                                <Select
                                    style={{boxShadow: "white"}}
                                    placeholder="informe as tags"
                                    options={tags || []}
                                    isMulti
                                    isLoading={loadingTags}
                                    onChange={this.handleTagsChangeTags.bind(this)}
                                />
                            </div>
                            <div className="form-group  col-12">
                                <button type='submit' className={`btn btn-primary  mr-2  ${loadingExercicios && 'btn-loading'}`}>
                                    Aplicar filtro <i className="fe fe-search" />
                                </button>
                                <button type='button' className={`btn btn-danger  ${loadingExercicios && 'btn-loading'}`}>
                                    Limpar filtro
                                </button>
                            </div>
                        </div>
                        </CardBody>
                            :null
                    }
               </Card>
                <Row mb={15}>
                    <Col xs={12}>
                        <table style={lista} className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    
                                    <th>N° de acessos</th>
                                    <th>Submissões gerais (corretas/total)</th>
                                   
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
                                            <td style={{display:'inline-flex'}}>
                                                {exercicio.isCorrect ? (
                                                    <>
                                                        <i
                                                            className="fa fa-check"
                                                            style={{ color: "#0f0" }}
                                                        />
                                                        &nbsp;
                                                    </>
                                                ) : null}
                                                {exercicio.title}
                                                
                                            </td>
                                            <td>{exercicio.code}</td>
                                            <td>{exercicio.accessCount}</td>
                                            <td>{`(${exercicio.submissionsCorrectsCount}/${exercicio.submissionsCount})`}</td>
                                            
                                            <td style={{display:'inline-flex'}}>
                                                <Link to={`/aluno/exercicio/${exercicio.id}`} >
                                                    <button className="btn btn-success mr-2">
                                                        Acessar <i className="fa fa-wpexplorer" />
                                                    </button>
                                                </Link>
                                                <button className="btn btn-primary mr-2" onClick={()=>this.handleShowModalInfo(exercicio)}>
                                                    <i className="fa fa-info"/>
                                                </button>
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
                <SwalModal
                    show={showModalInfo}
                    title="Exercício"
                    handleModal={this.handleCloseshowModalInfo.bind(this)}
                    width={'90%'}
                >
                <Card>
                    <CardHead>
                        <CardTitle>
                            {question && question.title}
                        </CardTitle>
                    </CardHead>
                    <CardBody>
                        <Row>
                            <b>Descrição: </b>
                        </Row>
                        <Row>
                            {question && question.description}
                        </Row>
                        <Row>
                            <Col xs={12} textCenter>
                                <BlockMath>{(question && question.katexDescription) || ''}</BlockMath>
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