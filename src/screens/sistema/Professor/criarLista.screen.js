import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import Swal from "sweetalert2";
import BotaoModal from 'components/ui/modal/btnModalExercicios.component'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import InputGroupo from 'components/ui/inputGroup/inputGroupo.component'
import formataData from "../../../util/funçoesAuxiliares/formataData";



const botao2 = {
    float: 'right',
    backgroundColor: "red",
    borderColor: 'red',
    color: 'white'
};

export default class CriarListaScreen extends Component {
    state = {
        redirect: false,
        items: [],
        selecionados: [],
        contentInputSeach:'',
        fildFilter:'title',
        title: '',
        perfil: sessionStorage.getItem("user.profile")
    };

    componentDidMount() {
        this.getExercicios();
    }

    async getExercicios(){
        let {contentInputSeach,fildFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&fild=${fildFilter}`
        try{
            const response = await api.get(`/question/page/1?${query}`)
            this.setState({items:[...response.data.docs]})
        }catch(err){
            console.log(err)
        
        }
    };

    submit = event => {
        event.preventDefault();

        if (this.state.title === "") {
          this.setState({ msg: "Informe o nome da turma" });
        } else if (this.state.selecionados.length === 0) {
          this.setState({ msg: "Selecione os professores" });
        }else{
            const requestInfo = {
                title: this.state.title,
                questions: this.state.selecionados,
            };

            api
                .post("/listQuestion/store", requestInfo)
                .then(response => {
                if (response) {
                    Swal.fire({
                    type: "success",
                    }).then(result => {
                    if (result.value) {
                    return this.setState({redirect:true});
                    }
                    });
                } else {
                    throw new Error("Failed to register");
                }
                })
                .catch(err => {
                this.setState({ msg: "Erro: Não foi possivel Criar a lista" });
                });
        }
    };

    selecionar = (e, questao) =>{
        e.preventDefault()
        for (var i = this.state.items.length -1; i >=0; i--) {
            if(questao.title === this.state.items[i].title){
                this.state.items.splice(i, 1);  
            }
        }

        this.setState({
            selecionados: [
                ...this.state.selecionados,
                questao
                ]
        });
        console.log(this.state.selecionados)

    };

    excluir = questao =>{
        for (var i = this.state.selecionados.length -1; i >=0; i--) {
            if(questao.title === this.state.selecionados[i].title){
                this.state.selecionados.splice(i, 1);
            }
        }
        this.setState({
            items: [
                ...this.state.items,
                questao
                ]
        });
    };

    handleTitleChange = e => {
        this.setState({ title: e.target.value });
        };

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
        <TemplateSistema active='listas'>
            <div className="container-fluid">
                <form onSubmit={this.submit}>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1>Criar Lista</h1><br></br>
                            </div>    
                            <br></br>

                            

                            <div className="row">
                                <input 
                                    type="text"
                                    value={this.state.name}
                                    onChange={this.handleTitleChange}
                                    className="form-control col-12" 
                                    placeholder="Titulo da lista"
                                />
                            </div>
                            <br/>
                            <div className="col-12">
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
                            <br></br>
                            <h4>Selecione as questões:</h4>
                            <br></br>

                            <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
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
                                {this.state.items.map((questao, index) => (
                                    <tr key={index}>
                                        <td>{questao.title}</td>
                                        <td>{questao.code}</td>
                                        <td>0{/*exercicio.executions.length*/}</td>
                                        <td>{questao.createdBy && questao.createdBy.email}</td>
                                        <td>{formataData(questao.createdAt)}</td>
                                        <td>
                                            <button className="float-right btn btn-primary" onClick={(e)=>this.selecionar(e, questao)}>Adicionar <i className="fe fe-file-plus" /></button>
                                        </td>
                                        
                                        
                                    </tr>
                                ))}
                                </tbody>
                                
                            </table>
                            <br/>
                            <hr/>
                            <h4>Selecionados:</h4>
                            <br/>
                            <table className="table table-hover">
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
                                    {this.state.selecionados.map((questao, index) => (
                                        <tr key={index}>
                                            <td>{questao.title}</td>
                                            <td>{questao.code}</td>
                                            <td>0{/*exercicio.executions.length*/}</td>
                                            <td>{questao.createdBy && questao.createdBy.email}</td>
                                            <td>{formataData(questao.createdAt)}</td>
                                            <td><a className="btn btn-primary" style={botao2} onClick={()=>this.excluir(questao)}><i className="fe fe-file-minus" /></a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <br></br>
                            <div className="">
                            <button type ="submit" className="btn btn-primary float-right col-3" onClick={this.submit} style={{width:"100%"}}>Criar Lista</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </TemplateSistema>
        )
    }
}