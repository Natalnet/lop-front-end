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
    items: [],
    filtro: []
  };

  render() {
    return (
      <div className="container-fluid form-control">
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
