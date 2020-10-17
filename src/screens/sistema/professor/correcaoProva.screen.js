import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import api from "../../../services/api";
//import NavPagination from "components/ui/navs/navPaginationTestCorrection";
import CorrecaoQuestao from "components/screens/correcaoQuestoesProvas.componente.screen";
//import CorrecaoQuestao from "components/screens/teste";
import Swal from "sweetalert2";
import apiCompiler from "../../../services/apiCompiler";
import { Link } from "react-router-dom";

import SupportedLanguages from "config/SupportedLanguages"


export default class AlunosProvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",

      //ids
      idTurma: this.props.match.params.id,
      idProva: this.props.match.params.idProva,
      idAluno: this.props.match.params.idAluno,

      loadingQuestion: false,
      redirect: false,
      loadingQuestoes: false,
      questoes: [],
      contentInputSeach: "",
      radioAsc: false,
      radioDesc: true,
      valueRadioSort: "DESC",
      showFilter: false,
      fildFilter: "title",
      docsPerPage: 15,
      numPageAtual: this.props.match.params.idQuestion,
      totalItens: 0,
      totalPages: 0,
      loadingInfoTurma: true,
      turma: {},
      timeConsuming: 0,
      char_change_number: 0,
      editor: "",
      editorRes: "",
      descriptionErro: "",
      language: SupportedLanguages.list[0],
      theme: "monokai",
      katexDescription: "",
      status: "PÚBLICA",
      difficulty: null,
      solution: "",
      results: [],
      loadingEditor: false,
      title: "",
      description: "",
      inputs: "",
      outputs: "",
      percentualAcerto: "",
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      feedBackTest: "",
      corrected: false,
      answer: "",
      teacherNote: null,
      loadingReponse: false,
      //SaveData
      comments: "",
      compilation_error: false,
      runtime_error: false,
      presentation_error: false,
      wrong_answer: false,
      invalid_algorithm: false,
      hitPercentage: 0,
      question_id: "",
      user: null,
      users: []
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.setState({ language: this.state.turma.languages[0] });
    await this.getUsersByClasse();
    await this.getStudentQuestions();
    await this.setCurrentQuestion(this.props.match.params.idQuestion);
    document.title = this.state.title;

    this.initialSubmission();
  }

  // async componentWillUnmount() {
  //   window.removeEventListener("popstate", this.redirecionar);
  // }

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
      //console.log('found turma: ',response.data)

      this.setState({
        turma: response.data,
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }

  async getUsersByClasse() {
    this.setState({ loadingUsers: true })
    const { id, idAluno } = this.props.match.params;
    try {
      const response = await api.get(`/user/class/${id}`)
      //console.log('users: ',response.data);
      this.setState({
        users: response.data,
        user: response.data.find(user => user.id === idAluno),
      })
    }
    catch (err) {
      console.log(err)
    }
  }

  //função que submete o codigo ao carregar a pagina
  async initialSubmission() {
    const { answer, language, results } = this.state;
    //this.setState({results: []})
    //console.log('answer: ',!!answer)
    if (!answer) return null;
    const request = {
      codigo: answer,
      linguagem: language,
      results: results,
    };

    this.setState({ loadingReponse: true });
    try {
      const response = await apiCompiler.post("/apiCompiler", request);
      this.setState({
        loadingReponse: false,
        results: response.data.results,
        percentualAcerto: response.data.percentualAcerto,
        descriptionErro: response.data.descriptionErro,
      });
    } catch (err) {
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({ loadingReponse: false });
      Swal.fire({
        type: "error",
        title: "ops... Algum erro aconteceu na operação :(",
      });
      console.log(err);
    }
  }

  //Coloca os dados da questao atual nos states
  async setCurrentQuestion(index) {
    const { questoes } = this.state;
    //if (loading) this.setState({ loadingquestion: true });
    //console.log('index:', index)
    const currentQuestion = questoes[index - 1]
    //verifica se já existe um feedback para questão
    if (!!currentQuestion.feedBackTest) {
      this.setState({
        comments: currentQuestion.feedBackTest.comments,
        compilation_error:
          currentQuestion.feedBackTest.compilation_error,
        runtime_error: currentQuestion.feedBackTest.runtime_error,
        presentation_error:
          currentQuestion.feedBackTest.presentation_error,
        wrong_answer: currentQuestion.feedBackTest.wrong_answer,
        invalid_algorithm:
          currentQuestion.feedBackTest.invalid_algorithm,
        teacherNote: (
          currentQuestion.feedBackTest.hitPercentage / 10
        ).toFixed(2),
      });
    }
    else {
      this.setState({
        comments: "",
        compilation_error: false,
        runtime_error: false,
        presentation_error: false,
        wrong_answer: false,
        invalid_algorithm: false,
        teacherNote: null,
      });
    }
    this.setState({
      title: currentQuestion.title,
      description: currentQuestion.description,
      katexDescription: currentQuestion.katexDescription,
      solution: currentQuestion.solution,
      difficulty: currentQuestion.difficulty,
      feedBackTest: currentQuestion.feedBackTest,
      results: [...currentQuestion.results],
      response: [...currentQuestion.results],
      question_id: currentQuestion.id,
    });
    //verifica se há um asubmissão para a questão
    if (currentQuestion.lastSubmission) {
      this.setState({
        answer: currentQuestion.lastSubmission.answer,
        language: currentQuestion.lastSubmission.language,
        hitPercentage: (
          currentQuestion.lastSubmission.hitPercentage / 10
        ).toFixed(2),
        timeConsuming: 0,
        char_change_number:
          currentQuestion.lastSubmission.char_change_number,
      });
    }
    else {
      this.setState({
        answer: "",
        language: this.state.turma.languages[0],
        hitPercentage: 0,
        timeConsuming: currentQuestion.lastSubmission.timeConsuming,
        char_change_number: 0,
      });
    }

    //verifica se a questão já foi editada pelo professor
    if (currentQuestion.feedBackTest && currentQuestion.feedBackTest.isEditedByTeacher) {
      this.setState({
        corrected: true,
      });
    }
    else {
      this.setState({
        corrected: false,
      });
    }
    this.setState({ loadingQuestion: false });
  }

  //Mostra a questao em tela
  ShowQuestion() {
    //console.log('turma: ',this.state.turma)
    return (
      <CorrecaoQuestao
        {...this.state}
        showAllTestCases={true}
        changeLanguage={this.changeLanguage.bind(this)}
        changeTheme={this.changeTheme.bind(this)}
        submeter={this.submeter.bind(this)}
        questao={this.state.questoes[this.state.numPageAtual]}
        SaveData={this.SaveData.bind(this)}
        checkBox1={this.checkBox1.bind(this)}
        checkBox2={this.checkBox2.bind(this)}
        checkBox3={this.checkBox3.bind(this)}
        checkBox4={this.checkBox4.bind(this)}
        checkBox5={this.checkBox5.bind(this)}
        commentQuestion={this.commentQuestion.bind(this)}
        funcTeacherNote={this.funcTeacherNote.bind(this)}
        alteredCode={this.alteredCode.bind(this)}
      />
    );
  }

  checkBox1() {
    if (this.state.compilation_error) {
      this.setState({
        compilation_error: false,
      });
    } else {
      this.setState({
        compilation_error: true,
      });
    }
  }
  checkBox2() {
    if (this.state.runtime_error) {
      this.setState({
        runtime_error: false,
      });
    } else {
      this.setState({
        runtime_error: true,
      });
    }
  }
  checkBox3() {
    if (this.state.presentation_error) {
      this.setState({
        presentation_error: false,
      });
    } else {
      this.setState({
        presentation_error: true,
      });
    }
  }
  checkBox4() {
    if (this.state.wrong_answer) {
      this.setState({
        wrong_answer: false,
      });
    } else {
      this.setState({
        wrong_answer: true,
      });
    }
  }
  checkBox5() {
    if (this.state.invalid_algorithm) {
      this.setState({
        invalid_algorithm: false,
      });
    } else {
      this.setState({
        invalid_algorithm: true,
      });
    }
  }
  commentQuestion(e) {
    this.setState({
      comments: e.target.value,
    });
  }
  alteredCode(e) {
    this.setState({
      answer: e,
    });
  }
  funcTeacherNote(e) {
    let teacherNote = e.target.value.replace(
      "^[0-9]{1,2}([,.][0-9]{1,2})?$",
      ""
    );
    if (teacherNote >= 0 && teacherNote <= 10) {
      this.setState({
        teacherNote,
      });
    }
  }

  //salva os dados do feedback da questao
  async SaveData(e) {
    e.preventDefault();
    const {
      question_id,
      idTurma,
      idProva,
      idAluno,
      questoes,
      numPageAtual,
      comments,
      compilation_error,
      runtime_error,
      presentation_error,
      wrong_answer,
      invalid_algorithm,
      teacherNote,
    } = this.state;
    let { hitPercentage } = this.state;
    let msg = "";
    teacherNote !== null
      ? (hitPercentage = teacherNote * 10)
      : (hitPercentage = hitPercentage * 10);
    msg +=
      parseFloat(teacherNote) > 10 || parseFloat(teacherNote) < 0
        ? "Nota invalida<br/>"
        : "";

    if (msg) {
      Swal.fire({
        type: "error",
        title: "Erro: Nota invalida",
        html: msg,
      });
      return 0;
    }

    const requestInfo = {
      comments: comments,
      compilation_error: compilation_error,
      runtime_error: runtime_error,
      presentation_error: presentation_error,
      wrong_answer: wrong_answer,
      invalid_algorithm: invalid_algorithm,
      hitPercentage: hitPercentage,
      user_id: idAluno,
      test_id: idProva,
      question_id: question_id,
      class_id: idTurma,
      submissions: questoes.map((q) => q.lastSubmission),
    };
    try {
      await api.post("/feedBacksTest/store", requestInfo);
      if (!msg && numPageAtual < questoes.length) {
        let proxPage = parseInt(numPageAtual) + 1;
        await this.redirecionar(proxPage);
      } else {
        Swal.fire({
          type: "success",
          title: "Feedback Salvo com sucesso",
        });
        window.location.replace(
          `/professor/turma/${idTurma}/correcaoprovas/${idProva}`
        );
      }
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title:
          "Erro: Não foi possivel cadastrar o feedback, verifique se contem erros!!!!",
      });
    }
  }

  //Pega do backend as questoes do aluno
  async getStudentQuestions(loading = true) {
    const { idTurma, idAluno, idProva } = this.state;
    let query = `?idClass=${idTurma}`;
    query += `&idTest=${idProva}`;
    query += `&idUser=${idAluno}`;
    try {
      if (loading) this.setState({ loadingQuestoes: true });
      const response = await api.get(`/feedBacksTest/show/${query}`);
      //console.log('questoes: ', response.data.questions);
      this.setState({
        questoes: [...response.data.questions],
        //user: response.data.user,
        loadingQuestoes: false,
      });
    } catch (err) {
      this.setState({ loadingQuestoes: false });
      console.log(err);
    }
    this.state.totalPages = this.state.questoes.length;
  }



  //retorna a quantidade de paginas a patir da quantidade de questoes
  totalPages() {
    return this.state.questoes.length;
  }

  //funcao usada para a mudanca de linguegem no ambiente de programação
  async changeLanguage(e) {
    this.setState({ language: e.target.value });
  }

  //função usada na mundança do tema no ambiente de programação
  async changeTheme(e) {
    this.setState({ theme: e.target.value });
  }

  //função usada para executar o codigo(apenas executa)
  async submeter(e) {


    e.preventDefault();
    const { answer, language, results } = this.state;
    if (!answer) return null;
    const request = {
      codigo: answer,
      linguagem: language,
      results: results,
    };

    this.setState({ loadingReponse: true });
    try {
      const response = await apiCompiler.post("/apiCompiler", request);
      this.setState({
        loadingReponse: false,
        results: response.data.results,
        percentualAcerto: response.data.percentualAcerto,
        descriptionErro: response.data.descriptionErro,
      });
    } catch (err) {
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({ loadingReponse: false });
      Swal.fire({
        type: "error",
        title: "ops... Algum erro aconteceu na operação :(",
      });
      console.log(err);
    }
  }

  async redirecionar(i) {
    // idTurma: this.props.match.params.id,
    // idProva: this.props.match.params.idProva,
    // idAluno: this.props.match.params.idAluno,
    const { id, idProva, idAluno } = this.props.match.params;
    this.setState({
      numPageAtual: i,
    });
    // this.props.history.push(
    //   `/professor/turma/${id}/prova/${idProva}/aluno/${idAluno}/page/${i}`
    // );
    this.setState({ loadingInfoTurma: true })
    window.location.replace(
      `/professor/turma/${id}/prova/${idProva}/aluno/${idAluno}/page/${i}`
    );

    // await this.setCurrentQuestion(i);
    // this.initialSubmission();
  }

  getCurretIndexUser() {
    const { users } = this.state;
    const { idAluno } = this.props.match.params;
    const currentUser = users.findIndex(user => user.id === idAluno)
    return currentUser;
  }
  getPrevUser() {
    const { users } = this.state;
    const index = this.getCurretIndexUser();
    const prevUser = users.find((user, i) => i === index - 1)
    //console.log('index: ',index,'prevuser: ',prevUser)
    return prevUser !== -1 ? prevUser : null;
  }
  getNextUser() {
    const { users } = this.state;
    const index = this.getCurretIndexUser();
    const nextUser = users.find((user, i) => i === index + 1)
    return nextUser !== -1 ? nextUser : null;
  }

  handleRedirect(idUser) {
    const { id, idQuestion, idProva } = this.props.match.params;
    // `/professor/turma/${id}/prova/${idProva}/aluno/${idAluno}/page/${i}`
    //this.props.match.params.idQuestion
    window.document.location.replace(`/professor/turma/${id}/prova/${idProva}/aluno/${idUser}/page/${idQuestion}`)
    // this.props.history.push(`/professor/turma/${id}/participantes/${idUser}/listas`);
    // this.getUserLists(idUser);
    // this.getUserTests(idUser)
  }


  render() {
    //window.addEventListener("popstate",this.redirecionarr.bind(this));
    const {
      loadingInfoTurma,
      users,
      // totalPages,
      // numPageAtual,
      // idAluno,
      loadingQuestoes,
      idTurma,
      idProva,
      user,
      questoes
    } = this.state;
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
                <h5 style={{ margin: "0px" }}>
                  <i className="fa fa-users mr-2" aria-hidden="true" />
                  <Link
                    to={`/professor/turma/${idTurma}/correcaoprovas/${idProva}`}
                  >
                    Voltar para as provas
                </Link>
                  <i className="fa fa-angle-left ml-2 mr-2" /> {user && user.name}
                </h5>
              )}
          </Col>
        </Row>
        {
          !loadingQuestoes &&
          <>
            <Row mb={15}>
              <Col xs={5}>
                <label htmlFor="selectAluno">Participantes: </label>
                <select
                  id="selectAluno"
                  className="form-control"
                  defaultValue={this.props.match.params.idAluno}
                  onChange={(e) => this.handleRedirect(e.target.value)}
                >
                  {users.map(user =>
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} - {user.email}
                    </option>
                  )}
                </select>
              </Col>
            </Row>
            <Row mb={15}>
              <Col md={12} >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>
                    <button
                      onClick={() => this.handleRedirect(this.getPrevUser() && this.getPrevUser().id)}
                      className={`btn btn-outline-primary ${!this.getPrevUser() ? 'd-none' : ''}`}
                    >
                      <i className="fa fa-chevron-left mr-2" />
                      {this.getPrevUser() && this.getPrevUser().name} - {this.getPrevUser() && this.getPrevUser().email}
                    </button>
                  </span>

                  <span>
                    <button
                      onClick={() => this.handleRedirect(this.getNextUser() && this.getNextUser().id)}
                      className={`btn btn-outline-primary ${!this.getNextUser() ? 'd-none' : ''}`}
                    >
                      {this.getNextUser() && this.getNextUser().name} - {this.getNextUser() && this.getNextUser().email}
                      <i className="fa fa-chevron-right ml-2" />
                    </button>
                  </span>
                </div>
              </Col>
            </Row>
          </>
        }
        {this.ShowQuestion()}
        {/* {loadingInfoTurma?
          <div className="loader" style={{ margin: "0px auto" }}></div>
          :
          this.ShowQuestion()

        } */}
        {/* <Row>
          <Col xs={12} textCenter>
            <NavPagination
              totalPages={this.totalPages()}
              pageAtual={numPageAtual}
              idAluno={idAluno}
              numQuestion={numPageAtual}
              idTurma={idTurma}
              idProva={idProva}
              redirecionar={this.redirecionar.bind(this)}
            />
          </Col>
        </Row> */}
        <Row>
          <Col xs={12}>
            {
              questoes.map((question, index) =>
                <button
                  key={question.id}
                  onClick={() => this.redirecionar(index + 1)}
                  //onClick={()=>this.handleQuestion(`/professor/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}/submissoes`,question.id)}
                  className={`btn ${String(index + 1) === this.props.match.params.idQuestion ? 'btn-primary disabled' : 'btn-outline-primary'} mr-5 mb-5`}
                >
                  {question.title}
                </button>
              )
            }
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}
