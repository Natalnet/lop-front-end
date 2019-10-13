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
    alignItems: 'center'
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
        professorsName: [],
        items: [],
        Id_P: [],
        prof: "",
        perfil: sessionStorage.getItem("user.profile")

    };
    componentDidMount(){
        document.title = "Criar Turma - professor";
    }

    async cadastro(event){
        event.preventDefault();
        console.log(" nome: "+this.state.name+"\n ano: "+this.state.year+"\n semestre: "+this.state.semester+"\n descriçao: "+this.state.description+"\n Status: "+this.state.state+"\n professores: "+this.state.Id_P)
        if (this.state.name === "") {
            this.setState({ msg: "Informe o nome da turma" });
        } 
        else if (this.state.year === "" || this.state.year > 2020 || this.state.year < 2010 ) {
            this.setState({ msg: "Informe o ano" });
        } 
        else if (this.state.Id_P.length === 0) {
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
                professores: this.state.Id_P
            };
            Swal.fire({
                title:'Criando turma',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
            Swal.showLoading()
            try{
                const response = await api.post("/class/store", requestInfo)
                Swal.hideLoading()
                Swal.fire({
                    type: 'success',
                    title: 'Turma criada com sucesso!',
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
    componentDidMount() {
        this.getProfessores();
        document.title = "Realizar Cadastro de turmas - Plataforma LOP";
    }

    async getProfessores(){
        try{
            const response = await api.get('/user/get/professores')
            this.setState({items:response.data})
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
    handleProfessorsChange = user => {
        
        for (var i = this.state.items.length -1; i >=0; i--) {
            if(user.name === this.state.items[i].name){
                this.state.items.splice(i, 1);  
            }
        }
        console.log(this.state.items)

        this.setState({
            professorsName: [
                ...this.state.professorsName,
                user
                ],
            Id_P: [
                ...this.state.Id_P,
                user.id
                ]
        });

    };

    excluir = user =>{
        for (var i = this.state.professorsName.length -1; i >=0; i--) {
            if(user.name === this.state.professorsName[i].name){
                this.state.professorsName.splice(i, 1);
            }
        }
        for (var i = this.state.Id_P.length-1; i >=0; i--) {
            if(user.id === this.state.Id_P[i]){
                this.state.Id_P.splice(i, 1);
            }
        }

        this.setState({
            items: [
                ...this.state.items,
                user
                ]
        });
    };

    render() {
        if (this.state.redirect) {
          return <Redirect to='/professor' />
        }
        return (
        <TemplateSistema active='home'>
            <div className="container-fluid">
                <form onSubmit={(e)=>this.cadastro(e)}>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1 styler={titulo}>Cadastro de Turmas:</h1><br></br>
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
                                <div className="col-6">
                                    <label  htmlFor="">Ano: </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="ex.: 2019"
                                        value={this.state.year}
                                        onChange={this.handleYearChange}
                                    />
                                </div>

                                <div className="col-6">
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
                            
                            <br></br>
                            <hr></hr>
                            <h3>Professores:</h3>

                            <Select
                                style={{boxShadow: "white"}}
                                options={this.state.items.map(t => ({ _id: t.id, label: t.name, enrollment: t.enrollment, email: t.email, name: t.name }))} 
                                closeMenuOnSelect={false}
                                onChange={this.handleProfessorsChange.bind(this)}                                
                            />

                            <br></br>

                            <h4>Professores Selecionados: </h4>
                            <br></br>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nome:</th>
                                        <th>Matrícula:</th>
                                        <th>E-mail:</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.professorsName.map((professor, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>
                                                <div 
                                                    className="avatar d-block" 
                                                    style={
                                                        {backgroundImage: `url(${professor.urlImage || 'https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg'})`}
                                                    }
                                                />
                                            </td>
                                            <td>{professor.name}</td>
                                            <td>{professor.enrollment}</td>
                                            <td>{professor.email}</td>
                                            <td><a className="btn btn-primary" style={botao2} onClick={()=>this.excluir(professor)}><i className="fa fa-user-times" /></a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr></hr>
                            <div>
                                <button style={botao} type="submit" className="btn btn-primary">Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </TemplateSistema>
        )
    }
}