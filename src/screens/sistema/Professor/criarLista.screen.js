import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import Swal from "sweetalert2";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import InputGroupo from 'components/ui/inputGroup/inputGroupo.component'
import formataData from "../../../util/funçoesAuxiliares/formataData";
import NavPagination from "components/ui/navs/navPagination";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";

const botao2 = {
    float: 'right',
    backgroundColor: "red",
    borderColor: 'red',
    color: 'white'
};

export default class CriarListaScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            redirect: false,
            exercicios: [],
            selecionados: [],
            fildFilter:'title',
            title: '',
            loadingExercicios:false,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            showModalInfo:false,
            question:''
        };
    }

    componentDidMount() {
        document.title = "Criar lista - professor"
        this.getExercicios();
    }

    async getExercicios(){
        let {contentInputSeach,numPageAtual,fildFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&fild=${fildFilter}`
        try{
            this.setState({loadingExercicios:true})
            const response = await api.get(`/question/page/${numPageAtual}?${query}`)
            console.log('exercicios:');
            console.log(response.data.docs);
            this.setState({
                exercicios:[...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingExercicios:false
            })
        }catch(err){
            this.setState({loadingExercicios:false})
            console.log(err)
        
        }
    };

    async criarLista(e){
        console.log('criar lista');
        e.preventDefault();
        if (this.state.title === "") {
          this.setState({ msg: "Informe o nome da turma" });
        } 
        else if(this.state.selecionados.length === 0) {
          this.setState({ msg: "Selecione os professores" });
        }
        else{
            const requestInfo = {
                title: this.state.title,
                questions: this.state.selecionados.map(q=>q.id),
            };
            try{
                Swal.fire({
                    title:'Criando lista',
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    allowEnterKey:false
                })
                Swal.showLoading()
                const response = await api.post("/listQuestion/store", requestInfo)
                Swal.hideLoading()
                Swal.fire({
                    type: 'success',
                    title: 'Lista criada com sucesso!',
                })
                this.setState({redirect:true});
            }
            catch(err){
                Swal.hideLoading()
                Swal.fire({
                    type: 'error',
                    title: 'Erro: Não foi possivel criar lista',
                })
                this.setState({ msg: "Erro: Não foi possivel Criar a lista" });
            }
        }
    };

    selecionar(questao){
        this.setState({
            selecionados: [...this.state.selecionados,questao]
        });
        //console.log(this.state.selecionados)
    };

    excluir(questao){
        this.setState({
            selecionados:[...this.state.selecionados].filter(q=>q.id!=questao.id),
            //exercicios: [...this.state.exercicios,questao]
        });
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
    handleTitleChange(e){
        this.setState({ title: e.target.value });
    };
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
        if(this.state.redirect){
            return <Redirect to='/professor/listas' />
        }
        const {loadingExercicios,contentInputSeach,numPageAtual,totalPages,selecionados,question,showModalInfo} = this.state

        return (
        <TemplateSistema active='listas'>
            <Card>
                <CardHead>
                    <CardTitle>
                    Criar lista
                    </CardTitle>
                </CardHead>
                <CardBody>
                    <form onSubmit={(e)=>this.criarLista(e)}>
                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="inputTitulo">Título</label>
                                <input 
                                    id="inputTitulo"
                                    type="text"
                                    value={this.state.name}
                                    onChange={(e)=>this.handleTitleChange(e)}
                                    className="form-control" 
                                    placeholder="Título da lista"
                                />  
                            </div> 
                        </div>
                        <div className="row">
                            <div className="form-group col-12">
                                <InputGroupo
                                    placeholder={`Perquise pelo nome ou código...`}
                                    value={contentInputSeach}
                                    handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                                    filterSeash={this.filterSeash.bind(this)}
                                    handleSelect={this.handleSelectfildFilter.bind(this)}
                                    options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                                    clearContentInputSeach={this.clearContentInputSeach.bind(this)}                           
                                />    
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-12">
                            <label >Selecione as questões</label>
                            <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
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
                                this.state.exercicios.map((questao, index) =>{
                                    return (
                                    <tr key={questao.id}>
                                        <td>{questao.title}</td>
                                        <td>{questao.code}</td>
                                        <td>0{/*exercicio.executions.length*/}</td>
                                        <td>{questao.author.email}</td>
                                        <td>{formataData(questao.createdAt)}</td>
                                        <td>
                                            <button type='button' className="btn btn-primary mr-2" onClick={()=>this.handleShowModalInfo(questao)}>
                                                <i className="fa fa-info"/>
                                            </button>
                                            {selecionados.map(s=> s.id).includes(questao.id)
                                             ?
                                                <button type='button' className="float-right btn btn-indigo disabled">
                                                    Selecionada
                                                </button>
                                            :
                                                <button type='button' className="float-right btn btn-primary" onClick={(e)=>this.selecionar(questao)}>
                                                    Adicionar <i className="fe fe-file-plus" />
                                                </button>
                                            }
                                        </td>
                                        
                                        
                                    </tr>
                                )})
                                }
                                </tbody>
                                
                            </table>
                            </div>
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
                            <hr/>
                        <div className='row'>
                            <div className='col-12 text-center'>
                            <label >Selecionadas</label>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Código</th>
                                        <th>Exaecuções</th>
                                        <th>Criado por</th>
                                        <th>Criado em</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selecionados.map((questao, index) => (
                                        <tr key={index}>
                                            <td>{questao.title}</td>
                                            <td>{questao.code}</td>
                                            <td>0{/*exercicio.executions.length*/}</td>
                                            <td>{questao.author.email}</td>
                                            <td>{formataData(questao.createdAt)}</td>
                                            <td><button type='button' className="btn btn-primary" style={botao2} onClick={()=>this.excluir(questao)}><i className="fe fe-file-minus" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 text-center'>
                            <button type ="submit" className="btn btn-primary float-right col-3" style={{width:"100%"}}>Criar Lista</button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            
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
                    {question.description}
                    <BlockMath>{question.katexDescription|| ''}</BlockMath>
                </CardBody>
            </Card>
            </SwalModal>
        </Card>
        </TemplateSistema>
        )
    }
}