import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Redirect } from 'react-router-dom';
import Select from 'react-select';

import TemplateSistema from "components/templates/sistema.template";

const botao = {
    marginTop: '10px',
    float: 'right'
};
const titulo = {
    aligntodosProfessores: 'center'
};
const botao2 = {
    float: 'right',
    backgroundColor: "red",
    borderColor: 'red',
    color: 'white'
};

export default class NovasTurmasScreen extends Component {
    state = {
        redirect: false,
        name: "",
        year: new Date().getFullYear().toString(),
        semester: new Date().getMonth()<6?"1":"2",
        description: "",
        state: "ATIVA",
        professoresSelecionados: [],
        todosProfessores: [],
        loadingInfoTurma:true,
        linguagensSelecionadas:[],
        linguagens: [
            {
                value:'javascript',
                label:'JavaScript'
            },
            {
                value:'cpp',
                label:'C++'
            }
        ],

    };
    async componentDidMount(){
        document.title = "Editar Turma - professor";
        await this.getProfessores();
        this.getInfoTurma()
          
    }
    async getInfoTurma(){
      const id = this.props.match.params.id
      try{
        const response = await api.get(`/class/${id}`)
        console.log('class:');
        console.log(response.data);
        await this.setState({
            name: response.data.name,
            year: response.data.year,
            semester: response.data.semester,
            description: response.data.description,
            state: response.data.description.state,
            professoresSelecionados: response.data.users
            .filter(
                p=>p.profile==="PROFESSOR"
            ).map(p=>{
                return {
                    id : p.id,
                    value : p.id,
                    label:p.email
                }
            }),
            linguagensSelecionadas:response.data.languages.map(language=>{
                return {
                    value : language,
                    label : language==="javascript"?"JavaScript":language==="cpp"?"C++":''
                }
            })

        })
        console.log(this.state.linguagensSelecionadas)
        this.setState({loadingInfoTurma:false})
        
      }
      catch(err){
          this.setState({loadingInfoTurma:false})
          console.log(err);
      }
    }   
    async atualizarTurma(event){
        event.preventDefault();
        console.log(" nome: "+this.state.name+"\n ano: "+this.state.year+"\n semestre: "+this.state.semester+"\n descriçao: "+this.state.description+"\n Status: "+this.state.state+"\n professores: "+this.state.professoresSelecionados)
        if (this.state.name === "") {
            this.setState({ msg: "Informe o nome da turma" });
        } 
        else if (this.state.year === "" || this.state.year > 2020 || this.state.year < 2010 ) {
            this.setState({ msg: "Informe o ano" });
        } 
        else if (this.state.professoresSelecionados.length === 0) {
            this.setState({ msg: "Selecione os professores" });
        }
        else
        {
            const requestInfo = {
                name: this.state.name,
                year: this.state.year,
                semester: this.state.semester,
                description: this.state.description,
                state: this.state.state,
                professores: this.state.professoresSelecionados.map(p=>p.id),
                languages: this.state.linguagensSelecionadas.map(l=>l.value)
            };
            Swal.fire({
                title:'Atualizando turma',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
            Swal.showLoading()
            try{
                const idClass = this.props.match.params.id
                const response = await api.put(`/class/${idClass}/update`, requestInfo)
                Swal.hideLoading()
                Swal.fire({
                    type: 'success',
                    title: 'Turma atualizada com sucesso!',
                })
                this.setState({redirect:true});
            }
            catch(err){
                Swal.hideLoading()
                Swal.fire({
                    type: 'error',
                    title: 'Erro: Não foi possivel cadastrar a Turma',
                })
                this.setState({ msg: "Erro: Não foi possivel cadastrar a Turma" });
            };
        }
    };
    async getProfessores(){
        try{
            const response = await api.get('/user/get/professores')
            this.setState({
                todosProfessores:response.data.map(p=>{
                    return {
                        value :p.id,
                        id:p.id,
                        label:p.email, 
                    }
                }),             
            })
        }catch(err){
            console.log(err)
        
        }
    };

    handleNameChange = e => {
    this.setState({ name: e.target.value });
    };
    handleYearChange = e => {
    this.setState({ year: e.target.value });
    };
    handleSemesterChange = e => {
    this.setState({ semester: e.target.value });
    };

    handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
    };
    handleStateChange = e => {
    this.setState({ state: e.target.value });
    };
    handleProfessorsChange = professores => {
        const {professoresSelecionados} = this.state
        this.setState({
            professoresSelecionados:professores || []
        })
    };
    handleLanguageChange = linguagens => {
        this.setState({
            linguagensSelecionadas:linguagens || []
        })
    };


    render() {
        if (this.state.redirect) {
          return <Redirect to='/professor' />
        }
        const {loadingInfoTurma} = this.state
        return (
        <TemplateSistema active='home'>
            {loadingInfoTurma?
                <div className="loader"  style={{margin:'0px auto'}}></div>
            :
                <form onSubmit={(e)=>this.atualizarTurma(e)}>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1 styler={titulo}>Atualização de Turmas:</h1><br></br>
                            </div>    

                            <span className="alert-danger">{this.state.msg}</span>
                            <br></br>

                            <label htmlFor="">Nome: </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nome de turma"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />

                            <div className="row">



                                <div className="col-4">
                                    <label  htmlFor="exampleFormControlSelect0">Ano: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect0" 
                                        defaultValue={this.state.year} 
                                        onChange={this.handleYearChange}
                                    >

                                    {
                                        
                                        [new Date().getFullYear()-1,new Date().getFullYear(),new Date().getFullYear()+1].map((ano,index)=>(
                                            <option key={ano} value={ano}>{ano}</option>
                                        ))
                                    }
                                        
                                    </select>
                                </div>

                                <div className="col-4">
                                    <label htmlFor="exampleFormControlSelect1">semestre: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect1" 
                                        defaultValue={this.state.semester} 
                                        onChange={this.handleSemesterChange}
                                    >
                                        <option value="1">1ºSemestre</option>
                                        <option value="2">2ºSemestre</option>
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="exampleFormControlSelect1">Status</label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect1" 
                                        defaultValue={this.state.state} 
                                        onChange={this.handleStateChange}
                                    >
                                        <option value={"ATIVA"}>ATIVA</option>
                                        <option value={"INATIVA"}>INATIVA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label  htmlFor="">Descrição</label>
                                <textarea 
                                    className="form-control" 
                                    id="" 
                                    rows="5"
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                >
                                </textarea>
                            </div>

                            <h3>Linguagens:</h3>
                            <Select
                                style={{boxShadow: "white"}}
                                
                                defaultValue={this.state.linguagensSelecionadas}
                                isMulti
                                options={this.state.linguagens} 
                                closeMenuOnSelect={false}
                                onChange={this.handleLanguageChange.bind(this)}                                
                            />
                            <h3>Professores:</h3>

                            <Select
                                style={{boxShadow: "white"}}
                                defaultValue={this.state.professoresSelecionados}
                                options={this.state.todosProfessores}
                                isMulti
                                closeMenuOnSelect={false}
                                onChange={this.handleProfessorsChange.bind(this)}                                
                            />

                            <br></br>

                            <br></br>

                            <div>
                                <button style={botao} type="submit" className="btn btn-primary">Atualizar turma</button>
                            </div>
                        </div>
                    </div>
                </form>
            }
        </TemplateSistema>
        )
    }
}