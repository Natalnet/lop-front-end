import React, { Component } from "react";
import api from "../../../services/api";
export default class pagUsuarios extends Component {
  state = {
    matricula: "",
    nome: "",
    curso: "",
    instituicao: "",
    e_mail: "",
    funcao: "",
    users: [],
    items: [],
    filtro: []
  };
  componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    const token = localStorage.getItem("auth-token");
    const { data } = await api.get("/admin/users", {
      headers: { authorization: "Bearer " + token }
    });

    data.docs.map(user => {
      return this.setState({
        users: [
          ...this.state.users,
          {
            matricula: user.enrollment,
            nome: user.name,
            curso: "C&T",
            instituicao: "UFRN",
            e_mail: user.email,
            funcao: user.profile
          }
        ]
      });
    });
  };
  render() {
    return (
      <div className="container-fluid form-control">
        <table className="table table-hover">
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
          <tbody>
            {this.state.users.map((user, index) => (
              <tr key={index}>
                <td>{user.matricula}</td>
                <td>{user.nome}</td>
                <td>{user.curso}</td>
                <td>{user.instituicao}</td>
                <td>{user.e_mail}</td>
                <td>
                  <select className="custom-select py-0 w-auto form-control-sm">
                    <option defaultValue>{user.funcao}</option>
                    <option defaultValue>PROFESSOR</option>
                    <option defaultValue>ADMINISTRADOR</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
