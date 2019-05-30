import React, { Component } from "react";
import Swal from "sweetalert2";
import List from "../List";
import api from "../../../services/api";

export default class pagCursos extends Component {
  state = {
    nome: "",
    inst: "",
    id: null,
    editItem: false,
    instituicoes: [],
    items: [],
    filtro: []
  };

  componentDidMount() {
    this.getInstituicoes();
    this.getCursos();
  }

  handleSubmit = async e => {
    e.preventDefault();
  };

  onSubmit = event => {
    event.preventDefault();

    if (this.state.editItem) {
      if (this.state.nome.length > 0) {
        const requestInfo = {
          nome: this.state.nome,
          instituicao: this.state.inst
        };
        const { id } = this.state;
        api
          .put(`/cursos/${id}`, requestInfo)
          .then(response => {
            if (response) {
              Swal.fire({
                type: "success",
                title: `Curso cadastrado`,
                confirmButtonText: "Voltar para o sistema"
              });
              this.setState({
                nome: "",
                inst: "",
                id: null,
                editItem: false,
                items: [],
                filtro: [
                  ...this.state.items,
                  this.state.nome + ", " + this.state.inst
                ]
              });
              this.getCursos();
            }
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: `Error ao cadastrar curso`,
              text: `error: ${err}`,
              confirmButtonText: "Voltar para o sistema"
            });
          });
      } else {
        Swal.fire({
          type: "error",
          title: `Campo curso vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      }
    } else {
      if (this.state.nome.length > 0) {
        const requestInfo = {
          nome: this.state.nome,
          instituicao: this.state.inst
        };
        api
          .post("/cursos", requestInfo)
          .then(response => {
            if (response) {
              Swal.fire({
                type: "success",
                title: `Curso cadastrado`,
                confirmButtonText: "Voltar para o sistema"
              });
              this.setState({
                nome: "",
                inst: "",
                id: null,
                editItem: false,
                items: [
                  ...this.state.items,
                  this.state.nome + ", " + this.state.inst
                ],
                filtro: [
                  ...this.state.items,
                  this.state.nome + ", " + this.state.inst
                ]
              });
            }
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: `Error ao cadastrar curso`,
              text: `error: ${err}`,
              confirmButtonText: "Voltar para o sistema"
            });
          });
      } else {
        Swal.fire({
          type: "error",
          title: `Campo curso vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      }
    }
  };

  handleNameChange = e => {
    this.setState({ nome: e.target.value });
  };

  handleInstChange = e => {
    this.setState({ inst: e.target.value });
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
  getInstituicoes = async () => {
    const { data } = await api.get("/instituicoes");

    return this.setState({
      instituicoes: [...data]
    });
  };

  getCursos = async () => {
    const { data } = await api.get("/cursos");

    data.map(curso => {
      return this.setState({
        items: [...this.state.items, curso.nome + ", " + curso.instituicao],
        filtro: [...this.state.items, curso.nome + ", " + curso.instituicao]
      });
    });
  };

  editCurso = async id => {
    const { data } = await api.get(`/cursos`);

    const curso = data.filter(item => item.id === id);

    this.setState({
      nome: curso[0].nome,
      inst: curso[0].instituicao,
      id: id,
      editItem: true
    });
  };

  render() {
    const { instituicoes } = this.state;

    return (
      <div className="container-fluid form-control">
        <form className="row" onSubmit={this.onSubmit}>
          <div className="col-md-12">
            <label htmlFor="inputNome">Nome do Curso:</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="inputNomeDisc"
              placeholder="Digite o Nome do curso. ex: C&T"
              value={this.state.nome}
              onChange={this.handleNameChange}
            />
          </div>

          <div className="col-md-6">
            <select
              className="custom-select"
              id=""
              style={{ marginTop: 20 }}
              value={this.state.inst}
              onChange={this.handleInstChange}
            >
              <option defaultValue>Selecione a instituição...</option>
              {instituicoes.map((inst, index) => (
                <option key={index} value={inst.nome}>
                  {inst.nome}
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
          edit={this.editCurso}
        />
      </div>
    );
  }
}
