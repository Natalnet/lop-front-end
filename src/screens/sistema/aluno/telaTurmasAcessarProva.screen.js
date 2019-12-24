import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import generateHash from "../../../util/funçoesAuxiliares/generateHash";
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
      turma: JSON.parse(sessionStorage.getItem("turma")) || ""
    };
  }
  componentWillMount() {
    const idClass = this.props.match.params.id;
    const turmas = JSON.parse(sessionStorage.getItem("user.classes"));
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase();
    if (turmas && !turmas.includes(idClass))
      this.props.history.push(`/${profile}`);
  }
  async componentDidMount() {
    this.getInfoTurma();
    this.getProva();
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
    const {id,idTest} = this.props.match.params;
    const idClass = id
    let query = `?idClass=${idClass}`
    try {
      const response = await api.get(`/test/${idTest}${query}`);
      const prova = response.data
      console.log('prova:',prova)
      const password = sessionStorage.getItem(`passwordTest-${prova && prova.id}`);
      const hashCode = `${generateHash(prova && prova.password)}-${prova && prova.id}`;
      if ((prova && prova.status === "FECHADA") || (!password) || (password !== hashCode)) {
        this.props.history.push(`/aluno/turma/${id}/provas`);
      } else {
        this.setState({
          prova,
          loandingProva: false
        });
        const {turma} = this.state
        document.title = `${turma && turma.name} - ${response.data.title}`;
      }
    } catch (err) {
      console.log(err);
    }
  }

  RecolherProva = e => {};

  render() {
    const { loadingInfoTurma, turma, loandingProva, prova } = this.state;
    const questions = prova && prova.questions
    const questionsCompleted = prova && prova.questions.filter(q => q.correctSumissionsCount>0);
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
                <Link to={`/aluno/turma/${this.props.match.params.id}/provas`}>
                  <button className="btn btn-success mr-2">
                    <i className="fa fa-arrow-left" /> Voltar para as Provas{" "}
                    <i className="fa fa-file-text" />
                  </button>
                </Link>
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
                                      {question.correctSumissionsCount > 0 ? (
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
                                  Suas submissões: {question.submissionsCount}
                                  <Link
                                    to={`/aluno/turma/${this.props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}
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
