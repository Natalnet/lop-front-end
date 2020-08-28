import React, { Component, Fragment } from "react";
import api, { baseUrlBackend } from "../../../services/api";
import Swal from "sweetalert2";

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import socket from "socket.io-client";
import profileImg from "../../../assets/perfil.png";

import SupportedLanguages from "config/SupportedLanguages"

export default class HomeAlunoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turmasAbertas: [],
      minhasTurmas: [],
      loadingMinhasTurmas: false,
      totalPages: 0,
      solicitacoes: [],
      loandingTurmasAbertas: false,
      descriptions: [],
      code: "",
      fieldFilter: "code",
    };
  }
  componentDidMount() {
    this.getTurmasAbertasRealTime();
    document.title = "Início | LoP";
  }
  componentWillUnmount() {
    this.io && this.io.close();
  }
  async getMinhasTurmas() {
    let myClasses = sessionStorage.getItem("myClasses");
    if (myClasses && typeof JSON.parse(myClasses) === "object") {
      myClasses = JSON.parse(myClasses);
      this.setState({ minhasTurmas: myClasses });
      return null;
    }
    let query = `?myClasses=yes`;
    try {
      this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/class${query}`);
      this.setState({
        minhasTurmas: [...response.data],
        loandingTurmasAbertas: false,
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getSolicitacoes(loading = true) {
    let query = `?mySolicitations=yes`;
    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/solicitation${query}`);
      this.setState({
        solicitacoes: [...response.data],
        //loandingTurmasAbertas:false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertas(loading = true) {
    const { code, minhasTurmas } = this.state;
    let query = `?code=${code || "null"}`;
    query += `&state=ATIVA`;
    query += `&idNotIn=${minhasTurmas.map((t) => t.id).join(" ")}`;

    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/class${query}`);
      this.setState({
        turmasAbertas: response.data,
        loandingTurmasAbertas: false,
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertasRealTime() {
    this.io = socket(baseUrlBackend);
    this.io.emit("connectRoonUser", sessionStorage.getItem("user.email"));

    this.io.on("RejectSolicitation", async (response) => {
      const { solicitacoes } = this.state;
      this.setState({
        solicitacoes: solicitacoes.filter((s) => s.class_id !== response),
      });
      //io.close();
    });

    this.io.on("AcceptSolicitation", (response) => {
      const { turmasAbertas } = this.state;
      const myNewClass = turmasAbertas.map((t) => {
        return {
          id: t.id,
          title: t.title,
        };
      });
      let myClasses = sessionStorage.getItem("myClasses");
      if (myClasses && typeof JSON.parse(myClasses) === "object") {
        myClasses = [...JSON.parse(myClasses), ...myNewClass];
      } else {
        myClasses = myNewClass;
      }
      sessionStorage.setItem("myClasses", JSON.stringify(myClasses));
      this.setState({
        minhasTurmas: myClasses,
        turmasAbertas: turmasAbertas.filter((t) => t.id !== response),
      });
    });
  }
  async solicitarAcesso(idClass) {
    const { value } = await Swal.fire({
      title: "Informe sua matrícula na instituição da qual essa turma pertence",
      confirmButtonText: "Ok",
      cancelButtonText: "Cancelar",
      input: "text",
      showCancelButton: true,
      inputValue: "", //valor inicial
      inputValidator: (value) => {
        if (!value) {
          return "Você precisa fornecer sua matrícula";
        }
      },
    });
    if (!value) return null;
    const request = {
      idClass,
      enrollment: value,
    };
    try {
      Swal.fire({
        title: "Processando solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      const response = await api.post(`/solicitation/store`, request);
      const { solicitacoes } = this.state;
      this.setState({
        solicitacoes: [...solicitacoes, response.data],
      });

      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação feita com sucesso!",
      });
      //this.setState({solicitando:''})
    } catch (err) {
      Swal.hideLoading();

      Swal.fire({
        type: "error",
        title: "ops... Falha ao tentar fazer solicitação",
      });
    }
  }
  async cancelarSolicitacao(idClass) {
    let query = `?idClass=${idClass}`;
    try {
      Swal.fire({
        title: "Cancelando Solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.delete(`/solicitation/delete${query}`);
      const { solicitacoes } = this.state;
      this.setState({
        solicitacoes: solicitacoes.filter((s) => s.class_id !== idClass),
      });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação cancelada!",
      });
      //console.log(response);

      await this.setState({ solicitando: "" });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Erro ao cancelar solicitação",
      });
      //this.setState({solicitando:''})
    }
  }
  async handleCode(e) {
    this.setState({
      code: e.target.value,
    });
  }
  async filterSeash(e) {
    await this.getMinhasTurmas();
    await this.getSolicitacoes();
    this.getTurmasAbertas();
  }
  async handleSelectFieldFilter(e) {
    this.setState({
      fieldFilter: e.target.value,
    });
  }
  async clearcode() {
    this.setState({
      code: "",
    });
    await this.getMinhasTurmas();
    await this.getSolicitacoes();
    this.getTurmasAbertas();
  }

  render() {
    const {
      solicitacoes,
      turmasAbertas,
      loandingTurmasAbertas,
      code,
    } = this.state;
    return (
      <TemplateSistema active="turmasAbertas">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>
              Perquise turmas abertas pelo código
            </h5>
          </Col>
        </Row>
        <Row mb={24}>
          <Col xs={12}>
            <InputGroupo
              placeholder={`Perquise pelo Código`}
              value={code}
              handleContentInputSeach={this.handleCode.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[{ value: "code", content: "Código" }]}
              clearContentInputSeach={this.clearcode.bind(this)}
              loading={loandingTurmasAbertas}
            />
          </Col>
        </Row>
        <Row>
          {turmasAbertas.map((turma) => {
            return (
              <Fragment key={turma.id}>
                <Col xs={12} lg={6}>
                  <Card>
                    <CardHead
                      style={{
                        backgroundColor: "rgba(190,190,190,0.2)",
                        maxHeight: "56px",
                      }}
                    >
                      <CardTitle>
                        <i className="fa fa-users" /> {turma.name} -{" "}
                        {turma.year}.{turma.semester}
                      </CardTitle>
                      <CardOptions>
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            margin: "0px",
                          }}
                        >
                          Código: {turma.code}
                        </p>
                      </CardOptions>
                    </CardHead>
                    <CardBody style={{ height: "110px" }}>
                      <p>
                        <b>Linguagens: </b>
                        {turma.languages.map((language) => {
                          return (
                            <img
                              className="ml-2"
                              width="25px"
                              key={language}
                              src={SupportedLanguages[language].icon}
                              alt={language}
                            />
                          );
                        })}
                      </p>
                      <p>
                        <b>Descrição da turma:</b> &nbsp; {turma.description}
                      </p>
                    </CardBody>
                    <CardFooter>
                      <div
                        className="avatar d-block"
                        style={{
                          float: "left",
                          margin: "5px 5px 5px 0px",
                          backgroundImage: `url(${
                            turma.author.urlImage || profileImg
                          })`,
                        }}
                      />
                      <div
                        style={{
                          margin: "4px",
                          alignItems: "center",
                          textAlign: "left",
                          float: "left",
                          fontSize: "10px",
                        }}
                      >
                        {turma.author.name}
                        <div className="row" />
                        {turma.author.email}
                      </div>
                      {solicitacoes
                        .map((s) => s.class_id)
                        .includes(turma.id) ? (
                        <button
                          onClick={() => this.cancelarSolicitacao(turma.id)}
                          className="btn btn-danger"
                          style={{
                            float: "right",
                            margin: "2px",
                            backgroundColor: "",
                            borderColor: "",
                          }}
                        >
                          Cancelar solicitação <i className="fa fa-users" /> -
                        </button>
                      ) : (
                        <button
                          onClick={() => this.solicitarAcesso(turma.id)}
                          className="btn btn-primary"
                          style={{
                            float: "right",
                            margin: "2px",
                            backgroundColor: "#2FB0C6",
                            borderColor: "#2FB0C6",
                          }}
                        >
                          Solicitar Acesso <i className="fa fa-users" /> +
                        </button>
                      )}
                      <ul className="social-links list-inline mb-0 mt-2">
                        <li
                          className="list-inline-item  ml-4"
                          title={`${turma.usersCount} participante(s)`}
                        >
                          <i className="fa fa-users mr-1" />
                          {turma.usersCount}
                        </li>
                        <li
                          className="list-inline-item"
                          title={`${turma.listsCount} lista(s)`}
                        >
                          <i className="fe fe-file-text mr-1" />
                          {turma.listsCount}
                        </li>
                        <li
                          className="list-inline-item"
                          title={`${turma.testsCount} prova(s)`}
                        >
                          <i className="fa fa-file-text-o mr-1" />
                          {turma.testsCount}
                        </li>
                      </ul>
                    </CardFooter>
                  </Card>
                </Col>
              </Fragment>
            );
          })}
        </Row>
      </TemplateSistema>
    );
  }
}
