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
    textAling: 'left',
    width: "100%",
    height: "100%",
    border: "0px"
}
const selecionar2 = {
    padding: "0px",
}

export default class novasTurmas extends Component {

    state = {
        redirect: false,
        name: "",
        ano: "",
        semestre: "",
        descricao: "",
        estado: "",
        professor: [],
        items: []
    };

    cadastro = event => {
        event.preventDefault();

        if (this.state.name === "") {
          this.setState({ msg: "Informe o nome da turma" });
        } else if (this.state.ano === "" || this.state.ano > 2020 || this.state.ano < 2010 ) {
          this.setState({ msg: "Informe o ano" });
        } else if (this.state.professor === "") {
          this.setState({ msg: "Selecione os professores" });
        } else{
            const requestInfo = {
                name: this.state.name,
                ano: this.state.year,
                semestre: this.state.semestre,
                descricao: this.state.descricao,
                estado: this.state.estado,
                professor: this.state.professor
            };

            api
                .post("/professor/classes", requestInfo)
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
        let dbfile = "http://localhost:3001/professor";
        fetch(dbfile)
            .then(res => res.json())
            .then(data => {
                data.map(user => {
                return this.setState({
                    items: [
                    ...this.state.items,
                    user.name
                    ]
                });
                });
            })
            .catch(e => console.log(e));
    };

    handleNomeChange = e => {
    this.setState({ name: e.target.value });
    };
    handleAnoChange = e => {
    this.setState({ ano: e.target.value });
    };
    handleSemestreChange = e => {
    this.setState({ semestre: e.target.value });
    };
    handleDescricaoChange = e => {
    this.setState({ descricao: e.target.value });
    };
    handleEstadoChange = e => {
    this.setState({ estado: e.target.value });
    };
    handleProfessorChange = e => {
        this.setState({
            professor: [
                ...this.state.professor,
                this.state.user
                ]
        });
        console.log(this.state.professor);
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
                                onChange={this.handleNomeChange}
                            />

                            <div className="row">
                                <div className="col-6">
                                    <label  htmlFor="">Ano: </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="ex.: 2019"
                                        value={this.state.ano}
                                        onChange={this.handleAnoChange}
                                    />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="exampleFormControlSelect1">semestre: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect1" 
                                        value={this.state.semestre} 
                                        onChange={this.handleSemestreChange}
                                    >
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
                                    value={this.state.descricao}
                                    onChange={this.handleDescricaoChange}
                                >
                                </textarea>
                            </div>

                            <label htmlFor="exampleFormControlSelect1">Estado</label>
                            <select 
                                className="form-control" 
                                id="exampleFormControlSelect1" 
                                value={this.state.estado} 
                                onChange={this.handleEstadoChange}
                            >
                                <option>Aberta</option>
                                <option>Fechada</option>
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
                                    {this.state.professor.map((professor, index) => (
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
                                    {this.state.items.map((user, index) => (
                                        <tr key={index}>
                                            <td style={selecionar2}>
                                                <button
                                                style={selecionar}
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={this.handleProfessorChange}
                                                >
                                                {user}
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