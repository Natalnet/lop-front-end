import React, { Component, Fragment } from "react";
import api, { baseUrlBackend } from "../../../services/api";
import Swal from "sweetalert2";

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/TurmasAbertasAlunos/cardHead.component";
import CardOptions from "components/ui/card/TurmasAbertasAlunos/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/TurmasAbertasAlunos/cardBody.component";
import CardFooter from "components/ui/card/TurmasAbertasAlunos/cardFooter.component";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import Collapse from "components/ui/collapse/collapse.component";
import ButtonToogle from "components/ui/collapse/buttonToogle.component";
import NavPagination from "components/ui/navs/navPagination";
import socket from "socket.io-client";

export default class HomeAlunoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPageAtual: 1,
      turmasAbertas: [],
      totalPages: 0,
      turmasSolicitadas: [],
      loandingTurmasAbertas: false,
      descriptions: [],
      contentInputSeach: "",
      fieldFilter: "name"
    };
    this.handlePage = this.handlePage.bind(this);
  }
  async componentDidMount() {
    await this.getTurmasSolicitadas();
    await this.getTurmasAbertas();
    this.getTurmasAbertasRealTime();
    document.title = "Início | LoP";
  }
  async getTurmasSolicitadas(loading = true) {
    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get("/solicitation");
      console.log("turmas solicitdas");
      console.log(response.data);
      this.setState({
        turmasSolicitadas: [...response.data]
        //loandingTurmasAbertas:false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertas(loading = true) {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach}`;
    query += `&field=${fieldFilter}`;
    console.log(query);
    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(
        `/class/open/page/${numPageAtual}?${query}`
      );
      console.log("turmas abertas:");
      console.log(response.data);
      this.setState({
        turmasAbertas: response.data.docs,
        totalTumasAbertas: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loandingTurmasAbertas: false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertasRealTime() {
    const io = socket(baseUrlBackend);
    io.emit("connectRoonUser", sessionStorage.getItem("user.id"));

    io.on("MyRequestsClass", async response => {
      await this.getTurmasSolicitadas(false);
      this.getTurmasAbertas(false);
    });
  }
  async handlePage(e, numPage) {
    e.preventDefault();
    console.log(numPage);
    await this.setState({ numPageAtual: numPage });
    await this.getTurmasSolicitadas();
    this.getTurmasAbertas();
  }
  async solicitarAcesso(idClass) {
    console.log(idClass);
    try {
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title: "Processando solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      const response = await api.post(`/solicitation/class/${idClass}/store`);
      console.log("solicitação:");
      console.log(response.data);
      await this.getTurmasSolicitadas(false);
      this.getTurmasAbertas(false);

      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação feita com sucesso!"
      });
      //this.setState({solicitando:''})
    } catch (err) {
      Swal.hideLoading();

      Swal.fire({
        type: "error",
        title: "ops... Falha ao tentar fazer solicitação"
      });
      //this.setState({solicitando:''})
    }
  }
  async cancelarSolicitacao(idTurma) {
    sessionStorage.getItem("user.id");
    try {
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title: "Cancelando Solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.delete(`/solicitation/class/${idTurma}/delete`);
      await this.getTurmasSolicitadas(false);
      this.getTurmasAbertas(false);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação cancelada!"
      });
      //console.log(response);

      await this.setState({ solicitando: "" });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Erro ao cancelar solicitação"
      });
      //this.setState({solicitando:''})
    }
  }
  async handleContentInputSeach(e) {
    console.log(e.target.value);
    this.setState({
      contentInputSeach: e.target.value
    });
  }
  async filterSeash(e) {
    await this.getTurmasSolicitadas();
    this.getTurmasAbertas();
  }
  async handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState({
      fieldFilter: e.target.value
    });
  }
  async clearContentInputSeach() {
    this.setState({
      contentInputSeach: ""
    });
    await this.getTurmasSolicitadas();
    this.getTurmasAbertas();
  }

  render() {
    const {
      totalPages,
      numPageAtual,
      turmasSolicitadas,
      turmasAbertas,
      loandingTurmasAbertas,
      fieldFilter,
      contentInputSeach
    } = this.state;
    const range = num => {
      let arr = [];
      for (let i = 0; i < num; i++) arr.push(i);
      return arr;
    };
    return (
      <TemplateSistema active="turmasAbertas">
        <Row mb={24}>
          <Col xs={12}>
            <InputGroupo
              placeholder={`Perquise pelo ${
                fieldFilter === "nome"
                  ? "Nome"
                  : fieldFilter === "code"
                  ? "Código"
                  : "..."
              }`}
              value={contentInputSeach}
              handleContentInputSeach={this.handleContentInputSeach.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[
                { value: "name", content: "Nome" },
                { value: "code", content: "Código" }
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loandingTurmasAbertas}
            />
          </Col>
        </Row>
        <Row>
          {loandingTurmasAbertas
            ? range(8).map(i => (
                <Fragment key={i}>
                  <Col xs={12} md={6}>
                    <Card>
                      <CardHead></CardHead>
                      <CardBody loading></CardBody>
                    </Card>
                  </Col>
                </Fragment>
              ))
            : turmasAbertas.map((turma, index) => {
                return (
                  <Fragment key={turma.id}>
                    <Col xs={12} md={6}>
                      <Card>
                        <CardHead
                          name={turma.name}
                          code={turma.code}
                          semestre={turma.semester}
                          ano={turma.year}
                        />
                        <div className="row">
                          <div className="col-3">
                            <CardOptions linguagens={turma.languages} />
                          </div>
                          <div className="col-9" style={{ paddingLeft: "0px" }}>
                            {console.log(turma.description)}
                            <CardBody description={turma.description} />
                          </div>
                        </div>
                        <CardFooter>
                          {turmasSolicitadas
                            .map(t => t.id)
                            .includes(turma.id) ? (
                            <button
                              onClick={() => this.cancelarSolicitacao(turma.id)}
                              className="btn btn-danger"
                              style={{
                                float: "right",
                                margin: "2px",
                                backgroundColor: "",
                                borderColor: ""
                              }}
                            >
                              Cancelar solicitação <i className="fa fa-users" />{" "}
                              -
                            </button>
                          ) : (
                            <button
                              onClick={() => this.solicitarAcesso(turma.id)}
                              className="btn btn-primary"
                              style={{
                                float: "right",
                                margin: "2px",
                                backgroundColor: "#2FB0C6",
                                borderColor: "#2FB0C6"
                              }}
                            >
                              Solicitar Acesso <i className="fa fa-users" /> +
                            </button>
                          )}
                        </CardFooter>
                      </Card>
                    </Col>
                  </Fragment>
                );
              })}
        </Row>
        <Row>
          <Col xs={12} textCenter>
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageAtual}
              handlePage={this.handlePage}
            />
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}

{
  /* <CardFooter>

{turmasSolicitadas
  .map(t => t.id)
  .includes(turma.id) ? (
  <button
    onClick={() => this.cancelarSolicitacao(turma.id)}
    className="btn btn-danger"
    style={{ float: "right" }}
  >
    Cancelar solicitação <i className="fa fa-users" />{" "}
    -
  </button>
) : (
  <button
    onClick={() => this.solicitarAcesso(turma.id)}
    className="btn btn-primary"
    style={{ float: "right" }}
  >
    Solicitar Acesso <i className="fa fa-users" /> +
  </button>
)}
</CardFooter> */
}
