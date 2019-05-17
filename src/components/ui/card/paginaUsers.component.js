import React, { Component } from "react";
import List from "../List";

export default class pagUsuarios extends Component {
  state = {
    matricula: "",
    nome: "",
    curso: "",
    instituicao: "",
    e_mail: "",
    funcao: "",
    items: []
  };

  render() {
    return (
      <div className="container-fluid form-control">
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

        <hr />

        <table className="table">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Curso</th>
              <th>instituição</th>
              <th>E-mail</th>
              <th>função</th>
            </tr>
          </thead>
        </table>
        <List items={this.state.items} />
      </div>
    );
  }
}
