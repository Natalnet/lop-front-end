import React, { Component } from "react";
import Swal from "sweetalert2";
import List from "../List";
import api from "../../../services/api";

export default class pagDisciplinas extends Component {
  state = {
    nome: "",
    codigo: "",
    curso: "",
    items: []
  };

  handleSubmit = async e => {
    e.preventDefault();
  };

  onSubmit = event => {
    event.preventDefault();

    if (this.state.nome.length > 0 && this.state.codigo.length > 0) {
      const requestInfo = {
        nome: this.state.nome,
        codigo: this.state.codigo,
        curso: this.state.curso
      };
      api
        .post("/disciplinas", requestInfo)
        .then(response => {
          if (response) {
            Swal.fire({
              type: "success",
              title: `Disciplina cadastrada`,
              confirmButtonText: "Voltar para o sistema"
            });
            this.setState({
              items: [
                ...this.state.items,
                this.state.nome + ", " + this.state.codigo
              ]
            });
          }
        })
        .catch(err => {
          Swal.fire({
            type: "error",
            title: `Error ao cadastrar disciplina`,
            text: `error: ${err}`,
            confirmButtonText: "Voltar para o sistema"
          });
        });
    } else {
      if (this.state.nome.length === 0) {
        Swal.fire({
          type: "error",
          title: `Campo disciplina vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      } else {
        Swal.fire({
          type: "error",
          title: `Campo código vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      }

      /*const requestInfo = {
          method: "POST",
          body: JSON.stringify({
            nome: this.state.nome,
            codigo: this.state.codigo    
          }),
          headers: new Headers({
            "Content-type": "application/json"
          })
        };
        this.setState({
          items: [
            ...this.state.items,
            this.state.nome + ", " + this.state.codigo 
          ]
          //Disciplina, codigo
        });*/
    }
  };

  handleNameChange = e => {
    this.setState({ nome: e.target.value });
  };

  handleCodigoChange = e => {
    this.setState({ codigo: e.target.value });
  };

  render() {
    return (
      <div className="container-fluid form-control">
        <form className="row" onSubmit={this.onSubmit}>
          <div className="col-md-6">
            <label htmlFor="inputNome">Nome da Disciplina:</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="inputNomeDisc"
              placeholder="Digite o Nome da disciplina. ex: Linguagem de programação"
              value={this.state.nome}
              onChange={this.handleNameChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputCodigo">Código:</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="inputCodigoDisc"
              placeholder="Digite o Código da disciplina. ex: 1234567"
              value={this.state.codigo}
              onChange={this.handleCodigoChange}
            />
          </div>

          <div className="col-md-6">
            <select className="custom-select" id="" style={{ marginTop: 20 }}>
              <option defaultValue>Selecione o Curso...</option>
              <option value="1">Ciencia e Tecnologia</option>
              <option value="2">Engenharia da ....</option>
              <option value="3">Tecnologia da Informação</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary mb-3 btn-sm"
            style={{ marginTop: 20, height: 40, width: 70, marginLeft: "10px" }}
          >
            Incluir
          </button>
        </form>

        <hr />

        <div className="input-group">
          <input
            className="form-control py-2 mt-2 mb-2"
            type="search"
            placeholder="Disciplina"
          />
          <span className="input-group-append mt-2 mb-2">
            <button className="btn btn-outline-secondary" type="button">
              <i className="fa fa-search" />
            </button>
          </span>
        </div>
        <List items={this.state.items} />
      </div>
    );
  }
}
