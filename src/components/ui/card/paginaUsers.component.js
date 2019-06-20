import React, { Component } from "react";
import api from "../../../services/api";
import ListUsers from "../ListUsers";
import Swal from "sweetalert2";

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
  handleOption = async (index, e) => {
    await this.setState({ funcao: e.target.value });
    const id = this.state.users[index].id;
    const nome = this.state.users[index].nome
    const token = localStorage.getItem("auth-token");
    const requestInfo = {
      profile: this.state.funcao
    };
    api.put(`/admin/users/${id}/update`, requestInfo, {
      headers: { authorization: "Bearer " + token }
    }).then(()=>{
      Swal.fire({
        type: "success",
        title: `Função alterada`,
        text:`${nome} agora é um ${this.state.funcao}`,
        confirmButtonText: "Voltar para o sistema"
      });
    }).catch(err=>{
      Swal.fire({
        type: "error",
        title: `Algo de errado aconteceu`,
        text:`${err}`,
        confirmButtonText: "Voltar para o sistema"
      });
    });
  };
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
            funcao: user.profile,
            id: user._id
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
                  {(() => {
                    if (user.funcao === "ALUNO") {
                      return (
                        <ListUsers
                          def1={user.funcao}
                          def2="PROFESSOR"
                          def3="ADMINISTRADOR"
                          value={this.state.funcao}
                          changeOption={e => this.handleOption(index, e)}
                        />
                      );
                    } else if (user.funcao === "ADMINISTRADOR") {
                      return (
                        <ListUsers
                          def1={user.funcao}
                          def2="PROFESSOR"
                          def3="ALUNO"
                          value={this.state.funcao}
                          changeOption={e => this.handleOption(index, e)}
                        />
                      );
                    } else if (user.funcao === "PROFESSOR") {
                      return (
                        <ListUsers
                          def1={user.funcao}
                          def2="ALUNO"
                          def3="ADMINISTRADOR"
                          value={this.state.funcao}
                          changeOption={e => this.handleOption(index, e)}
                        />
                      );
                    }
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
