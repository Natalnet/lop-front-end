import React, { Component,Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import {Modal} from 'react-bootstrap'
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Provas extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            provas: [],
            loadingInfoTurma:true,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            loandingTodasProvas:true,
            loandingProvas:false,
            showModalProvas:false,
            showModalInfo:false,
            todasprovas: [],
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            contentInputSeach:'',
            fieldFilter:'title',
            questions:[]
        };
    }

    async componentDidMount() {

        this.getProvas()
        this.getTodasProvas()
        await this.getInfoTurma()
        const {turma} = this.state
        document.title = `${turma && turma.name} - provas`;
        //this.getTodasProvas()
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

    async inserirProva(idProva){
        const idTurma = this.props.match.params.id
        try{
              Swal.fire({
                title:'Adicionando prova',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
              })
              Swal.showLoading()
              
              await api.post(`/class/${idTurma}/addTest/test/${idProva}`)
              await this.getTodasProvas()
              Swal.hideLoading()
              Swal.fire({
                  type: 'success',
                  title: 'Prova Adicionada com Sucesso!',
              })
              this.getProvas()
            
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Prova não pôde ser adicionado',
          })
        } 
    }
    async removerProva(prova){
        const idTest = prova.id
        console.log(prova);
        const idTurma = this.props.match.params.id
        try{
            const {value} = await Swal.fire({
                title: `Tem certeza que quer remover "${prova.title}" da turma?`,
                //text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, remover prova!',
                cancelButtonText:'Não, cancelar!'
            })
            if(!value) return null
            Swal.fire({
                title:'Removendo prova',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
            Swal.showLoading()
            await api.delete(`/class/${idTurma}/remove/test/${idTest}`)
            const {provas} = this.state
            this.getTodasProvas()
            this.setState({provas:provas.filter(prova=>prova.id!==idTest)})
            Swal.hideLoading()
            Swal.fire({
                type: 'success',
                title: 'Prova removido com sucesso!',
            })
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Prova não pôde ser removido',
          })
        }
    }
    async getProvas(){
        const id = this.props.match.params.id
        try{
            
            this.setState({loandingProvas:true})
            const response = await api.get(`/class/${id}/tests`)
            console.log('provas');
            console.log(response.data);
            this.setState({
                provas:[...response.data],
                loandingProvas:false,
            })

        }catch(err){
            this.setState({loandingProvas:false})
            console.log(err)
        
        }
    };

    async getTodasProvas(){
        const {numPageAtual,contentInputSeach,fieldFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&field=${fieldFilter}`
        try{
            this.setState({loandingTodasProvas:true})
            const id = this.props.match.params.id
            const response = await api.get(`/test/class/${id}/page/${numPageAtual}?${query}`)
            console.log('todasprovas');
            console.log(response.data.docs);
            this.setState({
                todasprovas:[...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loandingTodasProvas:false
            })
        }catch(err){
            this.setState({loandingTodasProvas:false})
            console.log(err)
        
        }
    };
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getTodasProvas())
    }
    handleShowModalInfo(questions){
        this.setState({
            showModalInfo:true,
            questions:[...questions]
        })
    }
    handleCloseshowModalInfo(e){
        this.setState({showModalInfo:false})
    }
    handleshowModalProvas(e){
        this.setState({showModalProvas:true})
    }
    handleCloseshowModalProvas(e){
        this.setState({showModalProvas:false})
    }

    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getTodasProvas()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getTodasProvas()*/)
    }
    filterSeash(){
        this.getTodasProvas()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getTodasProvas()) 
    }
    
    render() {
        const {loadingInfoTurma,turma,todasprovas,loandingTodasProvas,totalPages,numPageAtual,provas} = this.state
        const {contentInputSeach,fieldFilter,showModalProvas,questions,showModalInfo,loandingProvas} = this.state
        return (
        <TemplateSistema {...this.props} active={'provas'} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}</h3>
                        }
                    </div>
                </div>

                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-3">
                    <button className={`btn btn-primary ${loandingProvas && 'btn-loading'}`} onClick={()=>this.handleshowModalProvas()}>
                         Adicionar novas provas <i className="fa fa-plus-circle" />
                    </button>
                    </div>
                </div>

                <Row mb={15}>
                    
                    {loandingProvas
                    ?
                        <div className="loader"  style={{margin:'0px auto'}}></div>
                    :

                    provas.map((prova,i)=>{
                        const questions = prova.questions
                        const questionsCompleted = prova.questions.filter(q=>q.completed)
                        //const completed = (questionsCompleted.length/questions.length*100).toFixed(2)
                        return(
                        <Fragment key={prova.id}>
                        <Col xs={12}>
                        <Card key={prova.id} style={{margin:'2px'}}>
                            <CardHead>
                                <Col xs={5}>
                                    <h4 style={{margin:'0px'}}><b>{prova.title}</b></h4>
                                </Col>
                                <ProgressBar 
                                  numQuestions={questions.length}
                                  numQuestionsCompleted={questionsCompleted.length}
                                  dateBegin={prova.classHasTest.createdAt}
                                />
                                
                                <CardOptions>
                                    <Link to={`/professor/turma/${this.props.match.params.id}/prova/${prova.id}`}>
                                        <button className="btn btn-success mr-2">
                                            Acessar <i className="fa fa-wpexplorer" />
                                        </button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={()=>this.removerProva(prova)}>
                                        <i className="fa fa-trash "/>
                                    </button>
                                </CardOptions>
                            </CardHead>

                        </Card>
                        </Col>
                        </Fragment>
                        )
                    })
                    }
                    
                </Row>




            

                <Modal
                  show={showModalProvas} onHide={this.handleCloseshowModalProvas.bind(this)}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                    <Modal.Header>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Provas
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Fragment>
                    <Row mb={15}>
                        <div className=" col-12">     
                            <InputGroup
                                placeholder={`Perquise pelo ${fieldFilter==='title'?'Nome':fieldFilter==='code'?'Código':'...'}`}
                                value={contentInputSeach}
                                handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                                filterSeash={this.filterSeash.bind(this)}
                                handleSelect={this.handleSelectFieldFilter.bind(this)}
                                options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                                clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                                loading={loandingTodasProvas}                            
                            />
                        </div>
                    </Row>
                    <div className="row">
                        {loandingTodasProvas 
                        ?        
                            <div className="loader" style={{margin:'0px auto'}}/>
                        :
                            
                            todasprovas.map((prova,index)=>(
                                <div key={index} className="col-6"> 
                                    <Card>
                                        <CardHead>
                                            <CardTitle>
                                                {`${prova.title} - ${prova.code}`} 
                                            </CardTitle>
                                            <CardOptions>

                                                <div className="btn-group  float-right" role="group" aria-label="Exemplo básico">
                                                    <button className="btn-primary btn" onClick={()=>this.inserirProva(prova.id)} >Adicionar</button>
                                                        <button
                                                            className ="btn btn-primary"
                                                            data-toggle="collapse" data-target={'#collapse'+prova.id}
                                                            style={{position: "relative"}}
                                                        >
                                                        <i className="fe fe-chevron-down"/>
                                                    </button>
                                                </div>
                                            </CardOptions>
                                        </CardHead>
                                        <div className="collapse" id={'collapse'+prova.id}>
                                            <CardBody>
                                                <b>Questões: </b> <br/><br/>
                                                {prova.questions.map((questoes, index)=>(
                                                    <div key={index}>
                                                        <p>{index+1+" - "+questoes.title}</p>
                                                    </div>
                                                ))}
                                            </CardBody>
                                        </div>
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
                              handlePage={this.handlePage.bind(this)}
                            />
                        </div>
                    </div>
                </Fragment>
                </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-primary" onClick={this.handleCloseshowModalProvas.bind(this)}>Fechar</button>
              </Modal.Footer>
            </Modal>

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
                        <Card >
                            <CardHead>
                                <CardTitle>
                                    {questao.title}
                                </CardTitle>
                                <CardOptions>
                                    <button
                                        className ="btn btn-primary"
                                        data-toggle="collapse" data-target={'#collapse'+questao.id}
                                        style={{position: "relative"}}
                                    >
                                        <i className="fe fe-chevron-down"/>
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