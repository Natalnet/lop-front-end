import React, { Component } from "react";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import ExercicioScreen from "../../../components/screens/question.subscreen";

import SupportedLanguages from "../../../config/SupportedLanguages"

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: SupportedLanguages.list[0],
      response: [],
      katexDescription: "",
      difficulty: null,
      solution: "",
      results: [],
      title: "",
      description: "",
      percentualAcerto: "",
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      char_change_number: 0,
      oldTimeConsuming:0,
      submissionsCount: 0,
      submissionsCorrectsCount: 0,
      accessCount: 0,
      author: null,
      type: '',
alternatives: null
    };
  }

  async componentDidMount() {
    await this.getExercicio();
    document.title = `${this.state.title}`;
  }

  async getExercicio() {
    const idQuestion = this.props.match.params.idQuestion;
    let query = `?exclude=id code status createdAt updatedAt author_id solution`;
    query += `&draft=yes`;
    query += `&difficulty=yes`;
    try {
      const response = await api.get(`/question/${idQuestion}${query}`);
      this.setState({
        results: Array.isArray(response.data.results)?response.data.results: [],
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
        author: response.data.author,
        type: response.data.type,
alternatives: response.data.alternatives
      });
    } catch (err) {
      console.log(err);
      //this.setState({ loadingExercicio: false });
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
    const idQuestion = this.props.match.params.idQuestion;
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
    const { title, loadingExercicio } = this.state;
    return (
      <TemplateSistema active="exercicios">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>
              <Link to="/aluno/exercicios">Exercícios</Link>
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
          </Col>
        </Row>
        {loadingExercicio ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <ExercicioScreen
            {...this.state}
            {...this.props}
            idQuestion = {this.props.match.params.idQuestion}
            showAllTestCases={true}
            changeLanguage={this.changeLanguage.bind(this)}
            handleSolution={this.handleSolution.bind(this)}
            handleDifficulty={this.handleDifficulty.bind(this)}
          />
        )}
      </TemplateSistema>
    );
  }
}
