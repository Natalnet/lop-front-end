import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api, { baseUrlBackend } from "../../../services/api";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import socket from "socket.io-client";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Listas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      listas: [],
      loandingListas: true,
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      todasListas: []
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
    this.getListas();
    this.getListasRealTime();
    await this.getInfoTurma();
    const {turma} = this.state
    document.title = `${turma && turma.name} - listas`;
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
  async getListas() {
    try {
      const id = this.props.match.params.id;
      let query = `?idClass=${id}`
      const response = await api.get(`/listQuestion${query}`);
    
      console.log("listas");
      console.log(response.data);
      this.setState({
        listas: [...response.data],
        loandingListas: false
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }
  getListasRealTime() {
    const io = socket(baseUrlBackend);
    io.emit("connectRoonClass", this.props.match.params.id);

    io.on("addListToClass", response => {
      let { listas } = this.state;
      this.setState({ listas: [...listas, response] });
    });
    io.on("removeListFromClass", response => {
      let { listas } = this.state;
      this.setState({
        listas: listas.filter(lista => lista.id !== response.id)
      });
    });
  }
  render() {
    const { loadingInfoTurma, turma, loandingListas, listas } = this.state;
    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
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
        <Row mb={15}>
          {loandingListas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            listas.map((lista, i) => {
              const questions = lista.questions;
              const questionsCompleted = lista.questions.filter(q => q.completedSumissionsCount>0)
              return (
                <Fragment key={lista.id}>
                  <Col xs={12}>
                    <Card key={lista.id} style={{ margin: "2px" }}>
                      <CardHead>
                        <Col xs={5}>
                          <h4 style={{ margin: "0px" }}>
                            <b>{lista.title}</b>
                          </h4>
                        </Col>
                        <ProgressBar 
                          numQuestions={questions.length}
                          numQuestionsCompleted={questionsCompleted.length}
                          dateBegin={lista.classHasListQuestion.createdAt}
                          dateEnd={lista.classHasListQuestion.submissionDeadline}
                        />

                        <CardOptions>
                          <Link
                            to={`/aluno/turma/${this.props.match.params.id}/lista/${lista.id}`}
                          >
                            <button className="btn btn-success">
                              Acessar <i className="fa fa-wpexplorer" />
                            </button>
                          </Link>
                        </CardOptions>
                      </CardHead>
                    </Card>
                  </Col>
                </Fragment>
              );
            })
          )}
        </Row>
      </TemplateSistema>
    );
  }
}
