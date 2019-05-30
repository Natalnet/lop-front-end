import React, { Component } from "react";
import Swal from "sweetalert2";
import List from "../List";
import api from "../../../services/api";

export default class pagDisciplinas extends Component {
  state = {
    nome: "",
    codigo: "",
    curso: "",
    id: null,
    editItem: false,
    cursos: [],
    items: [],
    filtro: []
  };

  getCursos = async () => {
    const { data } = await api.get("/cursos");

    return this.setState({
      cursos: [...data]
    });
  };

  getDisciplinas = async () => {
    const { data } = await api.get("/disciplinas");

    data.map(disciplina => {
      return this.setState({
        items: [
          ...this.state.items,
          disciplina.nome + ", " + disciplina.curso + " - " + disciplina.codigo
        ],
        filtro: [
          ...this.state.items,
          disciplina.nome + ", " + disciplina.curso + " - " + disciplina.codigo
        ]
      });
    });
  };

  componentDidMount() {
    this.getCursos();
    this.getDisciplinas();
  }
  handleSubmit = async e => {
    e.preventDefault();
  };

  onSubmit = event => {
    event.preventDefault();

    if (this.state.editItem) {
      if (this.state.nome.length > 0 && this.state.codigo.length > 0) {
        const requestInfo = {
          nome: this.state.nome,
          codigo: this.state.codigo,
          curso: this.state.curso
        };
        const { id } = this.state;
        api
          .put(`/disciplinas/${id}`, requestInfo)
          .then(response => {
            if (response) {
              Swal.fire({
                type: "success",
                title: `Disciplina alterada com sucesso`,
                confirmButtonText: "Voltar para o sistema"
              });
              this.setState({
                nome: "",
                codigo: "",
                curso: "",
                id: null,
                editItem: false,
                items: [],
                filtro: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.curso +
                    " - " +
                    this.state.codigo
                ]
              });
              this.getDisciplinas();
            }
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: `Error ao editar disciplina`,
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
      }
    } else {
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
                nome: "",
                codigo: "",
                curso: "",
                id: null,
                editItem: false,
                items: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.curso +
                    " - " +
                    this.state.codigo
                ],
                filtro: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.curso +
                    " - " +
                    this.state.codigo
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
      }
    }
  };
  filtrar = e => {
    let ListaOriginal = [];
    let ListaNova = [];
    if (e.target.value !== "") {
      ListaOriginal = this.state.items;
      ListaNova = ListaOriginal.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      ListaNova = this.state.items;
    }
    this.setState({
      filtro: ListaNova
    });
  };
  handleNameChange = e => {
    this.setState({ nome: e.target.value });
  };
  handleCodigoChange = e => {
    this.setState({ codigo: e.target.value });
  };
  handleCursoChange = e => {
    this.setState({ curso: e.target.value });
  };

  editDisciplina = async id => {
    const { data } = await api.get(`/disciplinas`);

    const disciplina = data.filter(item => item.id === id);

    this.setState({
      nome: disciplina[0].nome,
      codigo: disciplina[0].codigo,
      curso: disciplina[0].curso,
      id: id,
      editItem: true
    });
  };

  render() {
    const { cursos } = this.state;
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
            <select
              className="custom-select"
              id=""
              style={{ marginTop: 20 }}
              value={this.state.curso}
              onChange={this.handleCursoChange}
            >
              <option defaultValue>Selecione o curso...</option>
              {cursos.map((curso, index) => (
                <option key={index} value={curso.nome}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          {this.state.editItem ? (
            <button
              type="submit"
              className="btn btn-primary mb-3 btn-sm"
              style={{
                marginTop: 20,
                height: 40,
                width: 70,
                marginLeft: "10px"
              }}
            >
              Alterar
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary mb-3 btn-sm"
              style={{
                marginTop: 20,
                height: 40,
                width: 70,
                marginLeft: "10px"
              }}
            >
              Salvar
            </button>
          )}
        </form>

        <hr />
        <List
          items={this.state.filtro}
          change={this.filtrar}
          edit={this.editDisciplina}
        />
      </div>
    );
  }
}
