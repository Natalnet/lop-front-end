import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Redirect } from 'react-router-dom'

const botao = {
    marginTop: '10px',
    float: 'right'
};
const titulo = {
    alignItems: 'center'
};
const selecionar = {
    textAling: "left",
    width: "100%",
    height: "100%",
    border: "0px"
};
const selecionar2 = {
    padding: "0px",
};

export default class novasTurmas extends Component {

    state = {
        redirect: false,
        name: "",
        year: "",
        semester: "",
        description: "",
        state: "",
        professorsName: [],
        items: [],
        Id_P: []
    };

    cadastro = event => {
        console.log(" nome: "+this.state.name+"\n ano: "+this.state.year+"\n semestre: "+this.state.semester+"\n descriçao: "+this.state.description+"\n Status: "+this.state.state+"\n professores: "+this.state.Id_P)

        event.preventDefault();

        if (this.state.name === "") {
          this.setState({ msg: "Informe o nome da turma" });
        } else if (this.state.year === "" || this.state.year > 2020 || this.state.year < 2010 ) {
          this.setState({ msg: "Informe o ano" });
        } else if (this.state.Id_P.length === 0) {
          this.setState({ msg: "Selecione os professores" });
        }else{
            const requestInfo = {
                name: this.state.name,
                year: this.state.year,
                semester: this.state.semester,
                description: this.state.description,
                state: this.state.state,
                professores: this.state.Id_P
            };

            api
                .post("/class/store", requestInfo)
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
                this.setState({ msg: "Erro: Não foi possivel cadastrar a Turma" });
                });
        }
    };

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/sistema/turmas' />
        }
      }

    componentDidMount() {
        this.getProfessores();
        document.title = "Realizar Cadastro de turmas - Plataforma LOP";
    }

    getProfessores = () => {
        let dbfile = "http://localhost:3001/user/get/professores";
        fetch(dbfile)
            .then(res => res.json())
            .then(data => {
                data.map(user => {
                return this.setState({
                    items: [
                    ...this.state.items,
                    user
                    ]
                });
                });
            })
            .catch(e => console.log(e));
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
        this.setState({

            professorsName: [
                ...this.state.professorsName,
                user.name
                ],
            Id_P: [
                ...this.state.Id_P,
                user._id
                ]
        });

    };

    render() {
        return (
            <div className="container-fluid">
                <form onSubmit={this.cadastro}>
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
                                        value={this.state.semester} 
                                        onChange={this.handleSemesterChange}
                                    >
                                        <option>selecione....</option>
                                        <option>1ºSemestre</option>
                                        <option>2ºSemestre</option>
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
                                value={this.state.state} 
                                onChange={this.handleStateChange}
                            >
                                <option>selecione....</option>
                                <option>ATIVA</option>
                                <option>DESATIVADA</option>
                            </select>
                            
                            <br></br>
                            <hr></hr>

                            <h4>Professores Selecionados: </h4>
                            <br></br>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Selecionados: </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.professorsName.map((professor, index) => (
                                        <tr key={index}>
                                            <td>{professor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div>
                                {this.renderRedirect()}
                                <button style={botao} type="submit" className="btn btn-primary" onClick={this.cadastro} >Cadastrar</button>
                            </div>

                            <br></br>
                            <hr></hr>
                            <div className="input-group mb-3">
                            <input type="text" 
                            className="form-control" 
                            placeholder="Recipient's username" 
                            aria-label="Recipient's username" 
                            aria-describedby="button-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" 
                                type="button" 
                                id="button-addon2"
                                >Pesquisar</button>
                            </div>
                            </div>

                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nome: </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.items.map((user) => (
                                        <tr key={user._id}>
                                            <td style={selecionar2}>
                                                <button
                                                style={selecionar}
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={()=>this.handleProfessorsChange(user)}
                                                >
                                                {user.name}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}