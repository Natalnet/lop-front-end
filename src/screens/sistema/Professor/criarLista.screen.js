import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import Swal from "sweetalert2";
import BotaoModal from 'components/ui/modal/btnModalExercicios.component'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import InputGroupo from 'components/ui/inputGroup/inputGroupo.component'


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
        fildFilter:'name',
        title: '',
        perfil: localStorage.getItem("user.profile")
    };

    componentDidMount() {
        this.getExercicio();
    }

    async getExercicio(){
        try{
            const response = await api.get('/question')
            this.setState({items:response.data})
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

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        },()=>this.getExercicio())
        
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        },()=>this.getExercicio())
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getExercicio())
        
    }

    render() {
        return (
        <TemplateSistema active='criarLista'>
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
                                    placeholder={'pesquiese pelo campo selecionado...'}
                                    value={this.contentInputSeach}
                                    handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                                    handleSelect={this.handleSelectfildFilter.bind(this)}
                                    options={ [{value:'name',content:'Nome'}] }
                                    clearContentInputSeach={this.clearContentInputSeach.bind(this)}                           
                                />    
                            </div>
                            <br></br>
                            <h4>Selecione as questões:</h4>
                            <br></br>

                            <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
                                <thead>
                                    <tr>
                                        <th>Titulo</th>
                                        <th>Dificuldade</th>
                                        <th>nota</th>
                                        <th></th>
                                        

                                    </tr>
                                </thead>                            
                                
                                <tbody>
                                {this.state.items.map((questao, index) => (
                                    <tr key={index}>
                                        <td>{questao.title}</td>
                                        <td>{questao.difficulty}</td>
                                        <td>8,5</td>
                                        <td>
                                            <button className="float-right btn btn-primary" onClick={(e)=>this.selecionar(e, questao)}>Adicionar</button>
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
                                        <th>Nome:</th>
                                        <th>Dificuldade:</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.selecionados.map((questao, index) => (
                                        <tr key={index}>
                                            <td>{questao.title}</td>
                                            <td>{questao.difficulty}</td>
                                            <td><a className="btn btn-primary" style={botao2} onClick={()=>this.excluir(questao)}><i className="fa fa-user-times" /></a></td>
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