import React, { Component } from "react";
import List from "../List";
import api from "../../../services/api";

export default class pagCursos extends Component {
  state = {
    nome: "",
    inst: "",
    instituicoes: [],
    items: []
  };

  componentDidMount() {
    this.getInstituicoes();
  }

  handleSubmit = async e => {
    e.preventDefault();
  };

  onSubmit = event => {
    event.preventDefault();

    /*const requestInfo = {
          method: "POST",
          body: JSON.stringify({
            nome: this.state.nome,
            codigo: this.state.codigo    
          }),
          headers: new Headers({
            "Content-type": "application/json"
          })
        };*/
    this.setState({
      nome: "",
      inst: "",
      items: [...this.state.items, this.state.nome + ", " + this.state.inst]
      //Disciplina, codigo
    });
  };

  handleNameChange = e => {
    this.setState({ nome: e.target.value });
  };

  handleInstChange = e => {
    this.setState({ inst: e.target.value });
  };

  getInstituicoes = async () => {
    const { data } = await api.get("/instituicoes");

    this.setState({
      instituicoes: [...data]
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
              placeholder="Digite o Nome do curso. ex: Linguagem de programação"
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
              <option selected>Selecione a instituição...</option>
              {instituicoes.map(inst => (
                <option value={inst.nome}>{inst.nome}</option>
              ))}
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

        <br />
        <hr />
        <br />

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
