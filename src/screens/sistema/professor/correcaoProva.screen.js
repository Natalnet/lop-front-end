import React, { Component } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import api from "../../../services/api";
//import NavPagination from "../../../components/ui/navs/navPaginationTestCorrection";
//import CorrecaoQuestao from "../../../components/screens/correcaoQuestoesProvas.componente.screen";
//import CorrecaoQuestao from "../../../components/screens/teste";
import Swal from "sweetalert2";
import apiCompiler from "../../../services/apiCompiler";
import { Link } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { BlockMath } from "react-katex";
import HTMLFormat from "../../../components/ui/htmlFormat";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import CardOptions from "../../../components/ui/card/cardOptions.component";
import SupportedLanguages from "../../../config/SupportedLanguages";
import AceEditorWrapper from "../../../components/templates/aceEditorWrapper.template";
import * as B from "../../../components/ui/blockly";
import { getBlocklyCode, isXml } from '../../../util/auxiliaryFunctions.util';
import { FaCheck } from 'react-icons/fa';

export default class AlunosProvas extends Component {
  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
    this.state = {
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",

      //ids
      idTurma: this.props.match.params.id,
      idProva: this.props.match.params.idProva,
      idAluno: this.props.match.params.idAluno,
      languages: SupportedLanguages.list,
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
      type: '',
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
    this.themes = [
      "monokai",
      "github",
      "tomorrow",
      "kuroir",
      "twilight",
      "xcode",
      "textmate",
      "solarized_dark",
      "solarized_light",
      "terminal",
    ];
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.setState({
      languages: this.state.turma.languages || SupportedLanguages.list,
      language: this.state.turma.languages[0],
    });
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
    console.log('language: ', language)
    //this.setState({results: []})
    //console.log('answer: ',!!answer)
    if (!answer) return null;
    const request = {
      codigo: language === "blockly" ? getBlocklyCode(this.simpleWorkspace.current.workspace) : answer,
      linguagem: language === "blockly" ? 'python' : language,
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
      type: currentQuestion.type,
      description: currentQuestion.description,
      katexDescription: currentQuestion.katexDescription,
      solution: currentQuestion.solution,
      difficulty: currentQuestion.difficulty,
      feedBackTest: currentQuestion.feedBackTest,
      results: Array.isArray(currentQuestion.results) ? [...currentQuestion.results] : [],
      response: Array.isArray(currentQuestion.results) ? [...currentQuestion.results] : [],
      alternatives: Array.isArray(currentQuestion.alternatives) ? [...currentQuestion.alternatives] : [],
      question_id: currentQuestion.id,
    });
    //verifica se há um asubmissão para a questão
    if (currentQuestion.lastSubmission) {
      this.setState({
        answer: currentQuestion.lastSubmission.answer,
        //language: currentQuestion.lastSubmission.language,
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
        //language: this.state.turma.languages[0],
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
      codigo: language === "blockly" ? getBlocklyCode(this.simpleWorkspace.current.workspace) : answer,
      linguagem: language === "blockly" ? 'python' : language,
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
      title,
      description,
      results,
      katexDescription,
      solution,
      answer,
      corrected,
      loadingQuestoes,
      idTurma,
      idProva,
      user,
      questoes,
      loadingReponse,
      language,
      theme,
      descriptionErro,
      type,
      hitPercentage,
      teacherNote,
      char_change_number,
      timeConsuming,
      compilation_error,
      comments,
      runtime_error,
      presentation_error,
      wrong_answer,
      invalid_algorithm,
      languages,
      alternatives
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

        <Row mb={10}>
          <Col xs={12}>
            <Card className="card-status-primary">
              <CardHead>
                <CardTitle>
                  <b>
                    <i className="fa fa-code mr-2" /> {title}
                  </b>
                </CardTitle>
              </CardHead>
              <CardBody className="overflow-auto">
                <Row>
                  {loadingQuestoes || !description ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                  ) : (
                      <Col xs={12} md={7}>
                        {/* <HTMLFormat>{description}</HTMLFormat> */}
                        <SunEditor
                          lang="pt_br"
                          height="auto"
                          disable={true}
                          showToolbar={false}
                          // onChange={this.handleDescriptionChange.bind(this)}
                          setContents={description || ""}
                          setDefaultStyle="font-size: 15px; text-align: justify"
                          setOptions={{
                            toolbarContainer: '#toolbar_container',
                            resizingBar: false,
                            katex: katex,
                          }}
                        />

                        {katexDescription ? (
                          <BlockMath>{katexDescription}</BlockMath>
                        ) : (
                            ""
                          )}
                      </Col>
                    )}
                  {loadingQuestoes ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                  ) : (
                      type === 'PROGRAMAÇÃO' &&
                      <Col xs={12} md={5}>
                        <table
                          className="table table-exemplo"
                          style={{
                            border: "1px solid rgba(0, 40, 100, 0.12)"
                          }}
                        >
                          <tbody>
                            <tr>
                              <td className="pt-0">
                                <b>Exemplo de entrada</b>
                              </td>
                              <td className="pt-0">
                                <b>Exemplo de saída</b>
                              </td>
                            </tr>
                            {results && results
                              .map((res, i) => (
                                <tr key={i}>
                                  <td>
                                    <HTMLFormat>{res.inputs}</HTMLFormat>
                                  </td>
                                  <td>
                                    <HTMLFormat>{res.output}</HTMLFormat>
                                  </td>
                                </tr>
                              ))
                              .filter((res, i) => i < 2)}
                          </tbody>
                        </table>
                      </Col>

                    )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {type === 'PROGRAMAÇÃO' &&
          <>
            <Row mb={10}>
              <Col xs={4} md={2}>
                <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
                <select className="form-control" onChange={(e) => this.changeLanguage(e)}>
                  {languages.map((lang) => {
                    const languageIdx = SupportedLanguages.list.indexOf(lang);
                    return (
                      <option key={lang} value={lang}>
                        {SupportedLanguages.niceNames[languageIdx]}
                      </option>
                    );
                  })}
                </select>
              </Col>
              <Col xs={4} md={2}>
                <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
                <select
                  defaultValue="monokai"
                  className="form-control"
                  onChange={(e) => this.changeTheme(e)}
                >
                  {this.themes.map((thene) => (
                    <option key={thene} value={thene}>
                      {thene}
                    </option>
                  ))}
                </select>
              </Col>
              <Col xs={4} md={2}>
                <label htmlFor="selectDifficul">&nbsp;</label>
                <button
                  style={{ width: "100%" }}
                  className={`btn btn-primary ${loadingReponse && "btn-loading"}`}
                  onClick={(e) => this.submeter(e)}
                >
                  <i className="fa fa-play" /> <i className="fa fa-gears" />{" "}
            &nbsp;&nbsp; Submeter
          </button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card>
                  {loadingQuestoes ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                  ) : (
                      language === 'blockly' ?
                        <B.BlocklyComponent
                          ref={this.simpleWorkspace}
                          readOnly={false}
                          trashcan={true}
                          media={'media/'}
                          move={{
                            scrollbars: true,
                            drag: true,
                            wheel: true
                          }}
                          initialXml={isXml(answer) ? answer : ''}>
                          <B.Category name="Texto" colour="20">
                            <B.Block type="text" />
                            <B.Block type="text_print" />
                            <B.Block type="text_prompt" />
                          </B.Category>
                          <B.Category name="Variáveis" colour="330" custom="VARIABLE"></B.Category>
                          <B.Category name="Lógica" colour="210">
                            <B.Block type="controls_if" />
                            <B.Block type="controls_ifelse" />
                            <B.Block type="logic_compare" />
                            <B.Block type="logic_operation" />
                            <B.Block type="logic_boolean" />
                            <B.Block type="logic_null" />
                            <B.Block type="logic_ternary" />
                          </B.Category>
                          <B.Category name="Laços" colour="120">
                            <B.Block type="controls_for" />
                            <B.Block type="controls_whileUntil" />
                            <B.Block type="controls_repeat_ext">
                              <B.Value name="TIMES">
                                <B.Shadow type="math_number">
                                  <B.Field name="NUM">10</B.Field>
                                </B.Shadow>
                              </B.Value>
                            </B.Block>
                          </B.Category>
                          <B.Category name="Matemática" colour="230">
                            <B.Block type="math_number" />
                            <B.Block type="math_arithmetic" />
                            <B.Block type="math_single" />
                            <B.Block type="math_round" />
                          </B.Category>
                          <B.Category name="Funções" colour="290" custom="PROCEDURE"></B.Category>
                        </B.BlocklyComponent>
                        :
                        <AceEditorWrapper
                          mode={language}
                          theme={theme}
                          focus={false}
                          onChange={(e) => this.alteredCode(e)}
                          value={answer || ""}
                          fontSize={14}
                          width="100%"
                          showPrintMargin={false}
                          name="ACE_EDITOR"
                          showGutter={true}
                          highlightActiveLine={true}
                        />
                    )}
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  {loadingQuestoes ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                  ) : (
                      language === 'blockly' ?
                        <B.BlocklyComponent
                          ref={this.simpleWorkspace}
                          readOnly={true}
                          trashcan={true}
                          media={'media/'}
                          move={{
                            scrollbars: true,
                            drag: true,
                            wheel: true
                          }}
                          initialXml={isXml(answer) ? answer : ''}>
                          <B.Category name="Texto" colour="20">
                            <B.Block type="text" />
                            <B.Block type="text_print" />
                            <B.Block type="text_prompt" />
                          </B.Category>
                          <B.Category name="Variáveis" colour="330" custom="VARIABLE"></B.Category>
                          <B.Category name="Lógica" colour="210">
                            <B.Block type="controls_if" />
                            <B.Block type="controls_ifelse" />
                            <B.Block type="logic_compare" />
                            <B.Block type="logic_operation" />
                            <B.Block type="logic_boolean" />
                            <B.Block type="logic_null" />
                            <B.Block type="logic_ternary" />
                          </B.Category>
                          <B.Category name="Laços" colour="120">
                            <B.Block type="controls_for" />
                            <B.Block type="controls_whileUntil" />
                            <B.Block type="controls_repeat_ext">
                              <B.Value name="TIMES">
                                <B.Shadow type="math_number">
                                  <B.Field name="NUM">10</B.Field>
                                </B.Shadow>
                              </B.Value>
                            </B.Block>
                          </B.Category>
                          <B.Category name="Matemática" colour="230">
                            <B.Block type="math_number" />
                            <B.Block type="math_arithmetic" />
                            <B.Block type="math_single" />
                            <B.Block type="math_round" />
                          </B.Category>
                          <B.Category name="Funções" colour="290" custom="PROCEDURE"></B.Category>
                        </B.BlocklyComponent>
                        :
                        <AceEditorWrapper
                          mode={language}
                          theme={theme}
                          focus={false}
                          value={solution}
                          fontSize={14}
                          width="100%"
                          showPrintMargin={false}
                          name="ACE_EDITOR"
                          showGutter={true}
                          highlightActiveLine={true}
                          readOnly={true}
                        />
                    )}
                </Card>
              </Col>
            </Row>
          </>
        }
        {type === 'DISCURSIVA' && (
          <Row mb={15}>
            <Col xs={12}>
              <label>Resposta do(a) aluno(a): </label>
              <textarea
                readOnly={true}
                className='form-control'
                value={answer || ""}
              />
            </Col>
          </Row>
        )}
        {
          type === 'OBJETIVA' && (
            <Row mb={15}>
              
              {
                    alternatives && alternatives.map((alternative, i) => (
                      <React.Fragment key={alternative.code}>
                        <div className="col-1">
                          <div
                            className='w-100 d-flex justify-content-center'
                          >
                            <span className='mr-2 d-flex align-items-center'>
                              <FaCheck
                                size={15}
                                color={`rgb(94, 186, 0, ${alternative.isCorrect ? '100' : '0'})`}
                              />
                            </span>
                            <Radio
                              value={alternative.code}
                              checked={alternative.code === answer}
                              inputProps={{ 'aria-label': i }}
                              disabled
                              color="primary"
                            />
                          </div>
                        </div>

                        <div className='col-11 mt-2'>
                          <div className='w-100 d-flex'>
                            <span className='mr-4 '>
                              {`${String.fromCharCode(65 + i)})`}
                            </span>
                            <div 
                            className='w-100 ' 
                            // ref={(el) => editorRef.current[i] = el}
                            >
                              <SunEditor
                                lang="pt_br"
                                height="auto"
                                disable={true}
                                showToolbar={false}
                                setContents={alternative.description}
                                setDefaultStyle="font-size: 15px; text-align: justify"
                                // onLoad={() => {
                                //   editorRef.current[i].classList.add('sun-editor-wrap')
                                // }}
                                setOptions={{
                                  toolbarContainer: '#toolbar_container',
                                  resizingBar: false,
                                  katex: katex,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  }
              
            </Row>
          )
        }
        <Row>
          {type === 'PROGRAMAÇÃO' &&
            <Col xs={12} md={6}>
              <Card className="card-results">
                <CardHead>
                  {loadingQuestoes ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                  ) : (
                      <CardTitle>Resultados</CardTitle>
                    )}
                </CardHead>
                {loadingReponse ? (
                  <div className="loader" style={{ margin: "100px auto" }}></div>
                ) : descriptionErro ? (
                  <Card>
                    {loadingQuestoes ? (
                      <div className="loader" style={{ margin: "0px auto" }}></div>
                    ) : (
                        <CardBody className=" p-0 ">
                          <div className="alert alert-icon alert-danger" role="alert">
                            <HTMLFormat>{descriptionErro}</HTMLFormat>
                          </div>
                        </CardBody>
                      )}
                  </Card>
                ) : (
                      <>
                        {results && results.map((teste, i) => (
                          <Card
                            key={i}
                            className={`card-status-${teste.isMatch ? "success" : "danger"
                              }`}
                          >
                            <CardHead>
                              <CardTitle>
                                {`${i + 1}° Teste `}
                                {teste.isMatch ? (
                                  <i
                                    className="fa fa-smile-o"
                                    style={{ color: "green" }}
                                  />
                                ) : (
                                    <i
                                      className="fa fa-frown-o"
                                      style={{ color: "red" }}
                                    />
                                  )}
                              </CardTitle>
                              <CardOptions>
                                <i
                                  title="Ver descrição"
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                    fontSize: "25px",
                                  }}
                                  className={`fe fe-chevron-down`}
                                  data-toggle="collapse"
                                  data-target={"#collapse" + i}
                                  aria-expanded={false}
                                />
                              </CardOptions>
                            </CardHead>
                            <div className="collapse" id={"collapse" + i}>
                              <CardBody className="p-0 overflow-auto">
                                {teste.descriptionErro ? (
                                  <HTMLFormat>{`${teste.descriptionErro}`}</HTMLFormat>
                                ) : (
                                    <table
                                      className="table"
                                      wrap="off"

                                    >
                                      <tbody>
                                        <tr>
                                          <td>
                                            <b>Entrada(s) para teste</b>
                                          </td>
                                          <td>
                                            <b>Saída do seu programa</b>
                                          </td>
                                          <td>
                                            <b>Saída esperada</b>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <HTMLFormat>{teste.inputs}</HTMLFormat>
                                          </td>
                                          <td>
                                            <HTMLFormat>{teste.saidaResposta}</HTMLFormat>
                                          </td>
                                          <td>
                                            <HTMLFormat>{teste.output}</HTMLFormat>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  )}
                              </CardBody>
                            </div>
                          </Card>
                        ))}
                      </>
                    )}
              </Card>
            </Col>
          }
          <Col xs={12} md={6}>
            <Card className="card-results">
              <CardHead>
                {loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                    <CardTitle>
                      Feed Back
                      {corrected ? (
                        <>
                          <label
                            style={{
                              color: "green",
                              fontSize: "16px",
                              marginLeft: "15px",
                            }}
                            htmlFor="selectDifficulty"
                          >
                            (Nota editada)
                      </label>
                        </>
                      ) : (
                          <>
                            <label
                              style={{
                                color: "#c88d04",
                                fontSize: "16px",
                                marginLeft: "15px",
                              }}
                              htmlFor="selectDifficulty"
                            >
                              (Nota não editada)
                      </label>

                          </>
                        )}
                    </CardTitle>
                  )}
              </CardHead>
              <CardBody className=" p-0 ">
                {loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                    <form
                      className="form-group"
                      style={{ marginRight: "5px", marginLeft: "5px" }}
                    >
                      <Row>
                        <Col xs={10} md={4}>
                          <label htmlFor="selectDifficulty">Nota do Sistema:</label>
                          <input
                            readOnly
                            style={{ textAlign: "center" }}
                            className={"form-control"}
                            type={"text"}
                            maxLength={"5"}
                            value={parseFloat(hitPercentage).toFixed(2)}
                          ></input>
                        </Col>

                        <Col xs={10} md={4}>
                          <label htmlFor="selectDifficulty">
                            Nota do professor:
                          </label>
                          <input
                            style={{ textAlign: "center" }}
                            className={`form-control ${parseFloat(teacherNote) > 10 ||
                              parseFloat(teacherNote) < 0 ||
                              isNaN(parseFloat(teacherNote))
                              ? "is-invalid"
                              : "is-valid"
                              }`}
                            onChange={(e) => this.funcTeacherNote(e)}
                            type={"text"}
                            maxLength={"5"}
                            value={teacherNote || ""}
                          ></input>
                        </Col>

                        <Col xs={10} md={4}>
                          <label htmlFor="rascunho">&nbsp;</label>
                          <button
                            style={{ width: "100%" }}
                            className={"btn btn-azure"}
                            onClick={(e) => this.SaveData(e)}
                          >
                            <i className="fa fa-floppy-o" />
                        &nbsp;&nbsp; Salvar Dados
                      </button>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: "10px" }}>
                        <Col xs={10} md={6}>
                          <label htmlFor="selectDifficulty">
                            Tempo gasto na questão:
                          </label>
                          <input
                            readOnly
                            style={{ paddingRight: "14px" }}
                            className={"form-control"}
                            type={"text"}
                            maxLength={"5"}
                            value={`
                          ${parseInt(
                              timeConsuming / 1000 / 60
                            )} min ${parseInt(
                              (timeConsuming / 1000) % 60
                            )} seg`}
                          ></input>
                        </Col>

                        {!!char_change_number && <Col xs={10} md={6}>
                          <label htmlFor="selectDifficulty">
                            Nº de variação de caracteres:
                      </label>
                          <input
                            readOnly
                            style={{ textAlign: "center" }}
                            className={"form-control"}
                            type={"text"}
                            maxLength={"5"}
                            value={parseFloat(char_change_number)}
                          ></input>
                        </Col>}
                      </Row>

                      <label
                        className="form-label"
                        style={{ marginLeft: "10px", marginTop: "5px" }}
                      >
                        Comentário da questão:
                  </label>
                      <textarea
                        className="form-control"
                        name="example-textarea-input"
                        rows="6"
                        placeholder="Digite.."
                        onChange={(e) => this.commentQuestion(e)}
                        value={comments}
                      ></textarea>

                      <div
                        className="custom-controls-stacked"
                        style={{ marginTop: "20px" }}
                      >
                        <Row>
                          <Col xs={12} md={6}>
                            <label className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name="compilation_error"
                                checked={compilation_error}
                                onChange={() => this.checkBox1()}
                              />
                              <span className="custom-control-label">
                                Erro em tempo de compilação
                          </span>
                            </label>
                            <label className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name="runtime_error"
                                checked={runtime_error}
                                onChange={() => this.checkBox2()}
                              />
                              <span className="custom-control-label">
                                Erro em tempo de execução
                          </span>
                            </label>
                            <label className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name="presentation_error"
                                checked={presentation_error}
                                onChange={() => this.checkBox3()}
                              />
                              <span className="custom-control-label">
                                Erro de apresentação
                          </span>
                            </label>
                          </Col>
                          <Col xs={12} md={6}>
                            <label className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name="wrong_answer"
                                checked={wrong_answer}
                                onChange={() => this.checkBox4()}
                              />
                              <span className="custom-control-label">
                                Resposta errada
                          </span>
                            </label>
                            <label className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name="invalid_algorithm"
                                checked={invalid_algorithm}
                                onChange={() => this.checkBox5()}
                              />
                              <span className="custom-control-label">
                                Algoritimo inválido
                          </span>
                            </label>
                          </Col>
                        </Row>
                      </div>
                    </form>
                  )}
              </CardBody>
            </Card>
          </Col>
        </Row>

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
