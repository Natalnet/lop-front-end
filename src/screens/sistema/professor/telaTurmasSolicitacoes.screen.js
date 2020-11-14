import React, { Component } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import Swal from "sweetalert2";
import socket from "socket.io-client";
import api, { baseUrlBackend } from "../../../services/api";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import profileImg from "../../../assets/perfil.png";

const lista = {
  backgroundColor: "white",
};
export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      loading: false,
      loadingUsers: true,
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getUsuarios();

    const { turma } = this.state;
    document.title = `${turma && turma.name} - Solicitações`;
    this.getUsuariosRealTime();
  }

  componentWillUnmount() {
    this.io && this.io.close();
  }

  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { myClasses } = this.state;
    if (myClasses && typeof myClasses === "object") {
      const index = myClasses.map((c) => c.id).indexOf(id);
      if (index !== -1) {
        this.setState({
          turma: myClasses[index],
        });
      }
      this.setState({ loadingInfoTurma: false });
      return null;
    }
    try {
      const response = await api.get(`/class/${id}`);
      this.setState({
        turma: response.data,
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }
  async getUsuarios(loadingResponse = true) {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`;
    query += `&solicitations=yes`;
    query += `&fields=id name email`;
    try {
      if (loadingResponse) this.setState({ loading: true });
      const response = await api.get(`/user${query}`);
      this.setState({
        usuarios: [...response.data],
        loading: false,
        loadingUsers: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        loadingUsers: false,
      });
      console.log(err);
    }
  }
  getUsuariosRealTime() {
    this.io = socket(baseUrlBackend);
    const id = this.props.match.params.id;
    this.io.emit("connectRoonClass", id); //conectando à sala

    this.io.on("soliciteClass", (response) => {
      const { usuarios } = this.state;
      this.setState({ usuarios: [...usuarios, response] });
    });
    this.io.on("cancelSolicitClass", (response) => {
      const { usuarios } = this.state;
      this.setState({
        usuarios: [...usuarios.filter((s) => s.id !== response)],
      });
    });
  }
  async aceitarTodos() {
    const idClass = this.props.match.params.id;
    let query = `?idClass=${idClass}`;
    const { usuarios } = this.state;
    const request = {
      users: usuarios,
    };
    try {
      const { value } = await Swal.fire({
        title: `Tem certeza que deseja adicionar todo mundo à turma?`,
        //text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, Adicionar!",
        cancelButtonText: "Não!",
      });
      if (!value) return null;
      Swal.fire({
        title: "Adicionando alunos",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      await api.put(`/solicitation/deleteall${query}`, request);
      await api.post(`/classHasUser/storeall${query}`, request);
      this.setState({
        usuarios: [],
      });
      Swal.fire({
        title: "Alunos Adicionados à turma!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Falha na operação :(",
      });
    }
  }
  async aceitaSolicitacao(user) {
    const idClass = this.props.match.params.id;
    const request = {
      idUser: user.id,
      enrollment: user.enrollment,
      idClass,
    };
    let query = `?userEmail=${user.email}`;
    try {
      Swal.fire({
        title: "Processando",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      await this.removeSolicitacao(user, false);
      await api.post(`/classHasUser/store${query}`, request);
      const { usuarios } = this.state;
      this.setState({
        usuarios: usuarios.filter((u) => u.id !== user.id),
      });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Usuário adicionado á turma com sucesso!",
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Usuário não pôde ser adicionado",
      });
    }
  }

  async removeSolicitacao(user, msg = true) {
    const idUser = user.id;
    const emailUser = user.email;
    const idClass = this.props.match.params.id;
    let query = `?idClass=${idClass}`;
    query += `&idUser=${idUser}`;
    query += `&emailUser=${emailUser}`;
    try {
      if (msg) {
        Swal.fire({
          title: "Processando",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        Swal.showLoading();
      }

      await api.delete(`/solicitation/delete${query}`);
      const { usuarios } = this.state;
      this.setState({ usuarios: usuarios.filter((u) => u.id !== idUser) });
      if (msg) {
        Swal.hideLoading();
        Swal.fire({
          type: "success",
          title: "Solicitação rejeitada com sucesso!",
        });
      }
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... algo deu errado na operação",
      });
    }
  }
  render() {
    const { usuarios, loadingUsers, turma, loadingInfoTurma } = this.state;
    return (
      <TemplateSistema
        {...this.props}
        active={"solicitações"}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" /> Solicitações
              </h5>
            )}
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12} textRight>
            {usuarios.length > 0 ? (
              <button
                onClick={() => this.aceitarTodos()}
                className="btn btn-success"
              >
                Adicionar todos <i className="fa fa-users mr-2" />
                <i className="fa fa-plus" />
              </button>
            ) : null}
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <table style={lista} className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>email</th>
                  <th>Matrícula</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user, i) => (
                    <tr key={i}>
                      <td className="text-center">
                        <div
                          className="avatar d-block"
                          style={{
                            backgroundImage: `url(${
                              user.urlImage || profileImg
                            })`,
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.enrollment}</td>
                      <td>
                        <button
                          onClick={() => this.aceitaSolicitacao(user)}
                          className="btn btn-success mr-2"
                        >
                          <i className="fa fa-user-plus" />
                        </button>
                        <button
                          onClick={() => this.removeSolicitacao(user)}
                          className="btn btn-danger mr-2"
                        >
                          <i className="fa fa-user-times" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}
