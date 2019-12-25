import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Swal from "sweetalert2";
import socket from "socket.io-client";
import api, { baseUrlBackend } from "../../../services/api";
const lista = {
  backgroundColor: "white"
};
export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      loading: false,
      loadingUsers: true,
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || ""
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getUsuarios();
    
    const {turma} = this.state
    document.title = `${turma && turma.name} - Solicitações`;
    this.getUsuariosRealTime();
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { turma } = this.state;
    if (!turma || (turma && turma.id !== id)) {
      console.log("dentro do if");
      try {
        const response = await api.get(`/class/${id}`);
        const turmaData = {
          id: response.data.id,
          name: response.data.name,
          year: response.data.year,
          semester: response.data.semester,
          languages: response.data.languages
        };
        this.setState({
          turma: turmaData,
          loadingInfoTurma: false
        });
        sessionStorage.setItem("turma", JSON.stringify(turmaData));
      } catch (err) {
        this.setState({ loadingInfoTurma: false });
        console.log(err);
      }
    } else {
      this.setState({ loadingInfoTurma: false });
    }
  }
  async getUsuarios(loadingResponse = true) {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`
    query += `&solicitations=yes`
    query += `&fields=id name email enrollment`
    try {
      if (loadingResponse) this.setState({ loading: true });
      const response = await api.get(`/user${query}`);
      console.log("solicitações");
      console.log(response.data);
      this.setState({
        usuarios: [...response.data],
        loading: false,
        loadingUsers: false
      });
    } catch (err) {
      this.setState({
        loading: false,
        loadingUsers: false
      });
      console.log(err);
    }
  }
  getUsuariosRealTime() {
    const io = socket(baseUrlBackend);
    console.log(io);
    const id = this.props.match.params.id;
    io.emit("connectRoonClass", id); //conectando à sala

    io.on("soliciteClass", response => {
      console.log("no socket");
      console.log(response);
      const {usuarios} = this.state
      this.setState({usuarios:[...usuarios,response]})
    });
    io.on("cancelSolicitClass", response => {
      console.log("no socket");
      console.log(response);
      const {usuarios} = this.state
      this.setState({usuarios:[...usuarios.filter(s=>s.id!==response)]})
    });  
  }
  async aceitaSolicitacao(idUser) {
    const idClass = this.props.match.params.id;
    const request={idUser,idClass}
    try {
      Swal.fire({
        title: "Processando",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await this.removeSolicitacao(idUser,false);
      await api.post(`/classHasUser/store`,request);
      //console.log(response);
      
      this.getUsuarios();
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Usuário adicionado á turma com sucesso!"
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Usuário não pôde ser adicionado"
      });
    }
  }

  async removeSolicitacao(idUser,msg=true) {
    const idClass = this.props.match.params.id;
    let query = `?idClass=${idClass}`
    query += `&idUser=${idUser}`
    try {
      if(msg){
        Swal.fire({
          title: "Processando",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        Swal.showLoading();
      }
      
      await api.delete(`/solicitation/delete${query}`);
      const {usuarios} = this.state
      this.setState({usuarios:usuarios.filter(u=>u.id!==idUser)})
      if(msg){
        Swal.hideLoading();
        Swal.fire({
          type: "success",
          title: "Solicitação rejeitada com sucesso!"
        });
      }
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... algo deu errado na operação"
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
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}
              </h3>
            )}
          </div>
        </div>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
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
                            backgroundImage: `url(${user.urlImage ||
                              "https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg"})`
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.enrollment}</td>
                      <td>
                        <button
                          onClick={() => this.aceitaSolicitacao(user.id)}
                          className="btn btn-success mr-2"
                        >
                          <i className="fa fa-user-plus" />
                        </button>
                        <button
                          onClick={() => this.removeSolicitacao(user.id)}
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
          </div>
        </div>
      </TemplateSistema>
    );
  }
}
