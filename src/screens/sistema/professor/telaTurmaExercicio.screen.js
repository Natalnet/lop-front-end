import React, { Component } from "react";
//import PropTypes from "prop-types";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ExercicioScreen from "components/screens/exercicio.componete.escreen";
import SupportedLanguages from "config/SupportedLanguages";

export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props) {
    super(props);
    this.state = {
      language: SupportedLanguages.list[0],
      response: [],
      katexDescription: "",
      status: "PÚBLICA",
      difficulty: "Médio",
      solution: "",
      results: [],
      title: "",
      description: "",
      lista: "",
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      loadingInfoTurma: true,
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      char_change_number: 0,
      oldTimeConsuming: 0,
      submissionsCount: 0,
      submissionsCorrectsCount: 0,
      accessCount: 0,
      author: null,
      
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getLista();
    await this.getExercicio();
    this.setState({ language: this.state.turma.languages[0] });

    document.title = `${this.state.title}`;
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

  async getLista() {
    try {
      const idClass = this.props.match.params.id;
      const idLista = this.props.match.params.idLista;
      let query = `?idClass=${idClass}`;
      const response = await api.get(`/listQuestion/${idLista}${query}`);
      this.setState({
        lista: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getExercicio() {
    const { id, idLista, idExercicio } = this.props.match.params;
    let query = `?exclude=id code status createdAt updatedAt author_id solution`;
    query += `&draft=yes`;
    query += `&idClass=${id}`;
    query += `&idList=${idLista}`;
    query += `&difficulty=yes`;
    try {
      const response = await api.get(`/question/${idExercicio}${query}`);
      this.setState({
        results: [...response.data.results],
        title: response.data.title,
        description: response.data.description,
        katexDescription: response.data.katexDescription || "",
        difficulty: response.data.difficulty,
        userDifficulty: response.data.userDifficulty || "",
        solution: response.data.questionDraft
          ? response.data.questionDraft.answer
          : "",
        char_change_number: response.data.questionDraft
          ? response.data.questionDraft.char_change_number
          : 0,
        oldTimeConsuming: response.data.lastSubmission
          ? response.data.lastSubmission.timeConsuming
          : 0,
        loadingExercicio: false,
        submissionsCount: response.data.submissionsCount,
        submissionsCorrectsCount: response.data.submissionsCorrectsCount,
        accessCount: response.data.accessCount,
        author: response.data.author
      });
    } catch (err) {
      this.setState({ loadingExercicio: false });
    }
  }


  async changeLanguage(e) {
    await this.setState({ language: e.target.value });
  }

  handleSolution(newValue) {
    this.setState({
      solution: newValue,
      char_change_number: this.state.char_change_number + 1,
    });
  }
  async handleDifficulty(e) {
    const userDifficulty = e.target ? e.target.value : "";
    const idQuestion = this.props.match.params.idExercicio;
    const request = {
      userDifficulty: userDifficulty,
      idQuestion,
    };
    try {
      this.setState({ loadDifficulty: true });
      await api.post(`/difficulty/store`, request);
      this.setState({
        userDifficulty: userDifficulty,
        loadDifficulty: false,
      });
    } catch (err) {
      this.setState({ loadDifficulty: false });
      console.log(err);
    }
  }

  render() {
    const {
      turma,
      title,
      lista,
      loadingExercicio,
      loadingInfoTurma,
    } = this.state;
    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{ margin: "0px", display: "inline" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" />
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/listas`}
                >
                  Listas
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/lista/${this.props.match.params.idLista}`}
                >
                  {lista ? (
                    lista.title
                  ) : (
                    <div
                      style={{
                        width: "140px",
                        backgroundColor: "#e5e5e5",
                        height: "12px",
                        display: "inline-block",
                      }}
                    />
                  )}
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
                {title || (
                  <div
                    style={{
                      width: "140px",
                      backgroundColor: "#e5e5e5",
                      height: "12px",
                      display: "inline-block",
                    }}
                  />
                )}
              </h5>
            )}
          </Col>
        </Row>
        {loadingExercicio ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <ExercicioScreen
            {...this.state}
            {...this.props}
            idQuestion={ this.props.match.params.idExercicio}
            idClass= {this.props.match.params.id}
            idList= { this.props.match.params.idLista}
            showAllTestCases={true}
            languages={turma && turma.languages}
            changeLanguage={this.changeLanguage.bind(this)}
            handleSolution={this.handleSolution.bind(this)}
            handleDifficulty={this.handleDifficulty.bind(this)}
          />
        )}
      </TemplateSistema>
    );
  }
}
