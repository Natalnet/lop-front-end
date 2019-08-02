import React, { Component } from "react";

import api from "../../../services/api";

import Swal from "sweetalert2";

const botao = {
    marginTop: '10px',
    float: 'right'
};
const titulo = {
    alignItems: 'center'
};

export default class novasTurmas extends Component {
    state = {
        redirect: false,
        name: "",
        curso: "",
        semestre: "",
        descricao: "",
        estado: "",
        professor: ""
    };

    cadastro = event => {
        event.preventDefault();

        if (this.state.name === "") {
          this.setState({ msg: "Informe o nome da turma" });
        } else if (this.state.curso === "") {
          this.setState({ msg: "Informe o curso" });
        } else if (this.state.semestre === "" || this.state.semestre >= 12 || this.state.semestre <= 0 ) {
          this.setState({ msg: "Informe o semestre da turma" });
        } else if (this.state.professor === "") {
          this.setState({ msg: "Selecione os professores" });
        } else{
            const requestInfo = {
                name: this.state.name,
                curso: this.state.curso,
                semestre: this.state.semestre,
                descricao: this.state.descricao,
                estado: this.state.estado,
                professor: this.state.professor
            };

            api
                .post("/professor/store", requestInfo)
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

    componentDidMount() {
        document.title = "Realizar Cadastro de turmas - Plataforma LOP";
    }
    handleNomeChange = e => {
    this.setState({ name: e.target.value });
    };
    handleCursoChange = e => {
    this.setState({ curso: e.target.value });
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
    this.setState({ professor: e.target.value });
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

                            <label  htmlFor="">Curso: </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="ex.: Ciências e tecnologia"
                                value={this.state.curso}
                                onChange={this.handleCursoChange}
                            />

                            <label  htmlFor="">Semestre: </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Ex.: 2º Semestre"
                                value={this.state.semestre}
                                onChange={this.handleSemestreChange}
                            />

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

                            Professores: 
                            <div className="input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-search"></i></span>
                                <input 
                                    name="consulta" 
                                    placeholder="Consultar" 
                                    type="text" 
                                    className="form-control"
                                    value={this.state.professor}
                                    onChange={this.handleProfessorChange}
                                />
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2">Pesquisar</button>
                            </div>

                            <table id="tabela" className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>

                            <button style={botao} type="submit" className="btn btn-primary" >Cadastrar</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}