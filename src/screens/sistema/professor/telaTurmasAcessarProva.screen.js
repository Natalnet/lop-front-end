import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";

import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      prova: null,
      loandingProva: true,
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      todasListas: []
    };
  }

  async componentDidMount() {
    document.title = "Professor - provas";
    await this.getInfoTurma();
    await this.getProva();
    const {turma,prova} = this.state
    document.title = `${turma && turma.name} - ${prova && prova.title}`;
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
  async getProva() {
    try {
      console.log("akii");
      console.log(this.props.match.params);
      const idClass = this.props.match.params.id;
      const idTest = this.props.match.params.idTest;
      const response = await api.get(`/test/${idTest}/class/${idClass}`);
      console.log("listas");
      console.log(response.data);
      this.setState({
        prova: response.data,
        loandingProva: false
      });
    } catch (err) {
      console.log(err);
    }
  }
  async aplicarProva() {
    const idTest = this.props.match.params.idTest;
    const query = `?idClass=${this.props.match.params.id}`;
    const request = {
      status: "ABERTA"
    };
    try {
      Swal.fire({
        title: "Aplicando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.put(`/test/${idTest}/update${query}`, request);
      const { prova } = this.state;
      prova.status = "ABERTA";
      this.setState({ prova });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova aplicada com sucesso!"
      });
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel aplicar prova"
      });
    }
  }
  async recolherProva() {
    const idTest = this.props.match.params.idTest;
    const query = `?idClass=${this.props.match.params.id}`;
    const request = {
      status: "FECHADA"
    };
    try {
      Swal.fire({
        title: "Recolhendo provas",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.put(`/test/${idTest}/update${query}`, request);
      const { prova } = this.state;
      prova.status = "FECHADA";
      this.setState({ prova });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Provas recolhidas com sucesso!"
      });
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel recolher provas"
      });
    }
  }

  render() {
    const { loadingInfoTurma, turma, loandingProva, prova } = this.state;
    const questions = prova && prova.questions
    const questionsCompleted = prova && prova.questions.filter(q => q.completed);

    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}
              </h3>
            )}
          </Col>
        </Row>
        {loandingProva ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={15}>
              <Col xs={12}>
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/provas`}
                >
                  <button className="btn btn-success mr-2">
                    <i className="fa fa-arrow-left" /> Voltar para as Provas{" "}
                    <i className="fa fa-file-text" />
                  </button>
                </Link>
                {prova && prova.status === "FECHADA" ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    onClick={e => this.aplicarProva()}
                  >
                    Aplicar prova <i className="fa fa-file-text" />
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    style={{ float: "right" }}
                    onClick={e => this.recolherProva()}
                  >
                    Recolher Prova <i className="fa fa-file-text" />
                  </button>
                )}

                <div
                  className="modal fade"
                  id="ModalRecolherProva"
                  tabIndex="-1"
                  role="dialog"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Recolher Prova</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <label htmlFor="inputSenha">Senha:</label>
                        <input
                          id="inputSenha"
                          type="password"
                          value={this.state.password}
                          className="form-control"
                          placeholder="Senha para recolher a prova"
                        />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger">
                          Recolher Prova
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row mb={15}>
              <Col xs={12}>
                <Card>
                  <CardHead>
                    <Col xs={4} pl={0}>
                      <h4 style={{ margin: "0px" }}>
                        <b>{prova && prova.title}</b>
                      </h4>
                    </Col>
                    <ProgressBar 
                      numQuestions={prova && questions.length}
                      numQuestionsCompleted={prova && questionsCompleted.length}
                      dateBegin={prova && prova.classHasTest.createdAt}
                      width={100}
                    />

                  </CardHead>
                  <CardBody>
                    <Row>
                      {prova &&
                        prova.questions.map((question, j) => (
                          <Fragment key={j}>
                            <Col xs={12} md={6}>
                              <Card>
                                <CardHead>
                                  <CardTitle>
                                    <b>
                                      {question.title}&nbsp;
                                      {question.completed ? (
                                        <i
                                          className="fa fa-check"
                                          style={{ color: "#0f0" }}
                                        />
                                      ) : null}
                                    </b>
                                  </CardTitle>
                                  <CardOptions>
                                    <i
                                      title="Ver descrição"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "25px"
                                      }}
                                      className={`fe fe-chevron-down`}
                                      data-toggle="collapse"
                                      data-target={
                                        "#collapse2" + j + (prova && prova.id)
                                      }
                                      aria-expanded={false}
                                    />
                                  </CardOptions>
                                </CardHead>
                                <div
                                  className="collapse"
                                  id={"collapse2" + j + (prova && prova.id)}
                                >
                                  <CardBody>{question.description}</CardBody>
                                </div>
                                <CardFooter>
                                  Suas submissões: {question.submissions.length}
                                  <Link
                                    to={`/professor/turma/${this.props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}
                                  >
                                    <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                      Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            </Col>
                          </Fragment>
                        ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
