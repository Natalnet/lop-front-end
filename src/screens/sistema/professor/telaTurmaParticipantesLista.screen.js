import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
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
      lista: '',
      usuario: '',
      loandingLista: true,
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      todasListas: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getLista();
    const {turma,lista} = this.state
    document.title = `${turma && turma.name} - ${lista && lista.title}`;
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
  async getLista() {
    try {
      const { id, idLista, idUser } = this.props.match.params;
      const response = await api.get(
        `/listQuestion/${idLista}/class/${id}/user/${idUser}`
      );
      console.log("listas");
      console.log(response.data);
      this.setState({
        lista: response.data.list,
        usuario: response.data.user,
        loandingLista: false
      });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const {
      loadingInfoTurma,
      turma,
      loandingLista,
      lista,
      usuario
    } = this.state;
    const questions = lista && lista.questions
    const questionsCompleted = lista && lista.questions.filter(q => q.completed);

    return (
      <TemplateSistema
        {...this.props}
        active={"participantes"}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          {loadingInfoTurma || loandingLista ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            <Col xs={12}>
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} |{" "}
                {usuario && usuario.name} - {usuario && usuario.enrollment}
              </h3>
            </Col>
          )}
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <Link
              to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/listas`}
            >
              <button className="btn btn-success mr-2">
                <i className="fa fa-arrow-left" /> Voltar para listas e provas{" "}
                <i className="fa fa-file-text" />
              </button>
            </Link>
          </Col>
        </Row>

        {loandingLista ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={15}>
              <Col xs={12}>
                <Card>
                  <CardHead>
                    <Col xs={4} pl={0}>
                      <h4 style={{ margin: "0px" }}>
                        <b>{lista && lista.title}</b>
                      </h4>
                    </Col>

                    <ProgressBar 
                      numQuestions={lista && questions.length}
                      numQuestionsCompleted={lista && questionsCompleted.length}
                      dateBegin={lista && lista.classHasListQuestion.createdAt}
                      dateEnd={lista && lista.classHasListQuestion.submissionDeadline}
                      width={100}
                    />
                  </CardHead>
                  <CardBody>
                    <Row>
                      {lista &&
                        lista.questions.map((question, j) => (
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
                                        "#collapse2" + j + (lista && lista.id)
                                      }
                                      aria-expanded={false}
                                    />
                                  </CardOptions>
                                </CardHead>
                                <div
                                  className="collapse"
                                  id={"collapse2" + j + (lista && lista.id)}
                                >
                                  <CardBody>{question.description}</CardBody>
                                </div>
                                <CardFooter>
                                  Submissões: {question.submissions.length}
                                  <Link
                                    to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/listas/${lista && lista.id}/exercicio/${question.id}`}
                                  >
                                    <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                      Ver submissões{" "}
                                      <i className="fa fa-wpexplorer" />
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
