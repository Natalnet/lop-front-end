import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import api from "../../../services/api";
import NavPagination from "components/ui/navs/navPaginationTestCorrection";
import CorrecaoQuestao from "components/screens/correcaoQuestoesProvas.componente.screen";
//import CorrecaoQuestao from "components/screens/teste";
import Swal from "sweetalert2";
import apiCompiler from "../../../services/apiCompiler";
import { Link } from "react-router-dom";

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
      numPageAtual: this.props.match.url.split(":").slice(1, 2),
      totalItens: 0,
      totalPages: 0,
      loadingInfoTurma: false,
      turma: "",

      editor: "",
      editorRes: "",
      descriptionErro: "",
      language: "javascript",
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
      char_change_number: 0,
      feedBackTest: "",

      answer: "",
      teacherNote: null,

      //SaveData
      comments: "",
      compilation_error: true,
      runtime_error: true,
      presentation_error: true,
      wrong_answer: true,
      invalid_algorithm: true,
      hitPercentage: 0,
      question_id: "",
    };
  }
  async componentDidMount() {
    document.title = "Questoes Feitas do aluno";
    await this.getStudentQuestions();
    await this.currentQuestion();
    console.log("AKIIIIII");
    console.log(this.props);
  }

  //Coloca os dados da questao atual nos states
  currentQuestion(loading = true) {
    const { questoes, numPageAtual, loadingQuestion } = this.state;
    if (loading) this.setState({ loadingquestion: true });

    console.log("TESTE");
    console.log(this.state.compilation_error);
    if (questoes[numPageAtual - 1].feedBackTest) {
      this.setState({
        comments: questoes[numPageAtual - 1].feedBackTest.comments,
        compilation_error:
          questoes[numPageAtual - 1].feedBackTest.compilation_error,
        runtime_error: questoes[numPageAtual - 1].feedBackTest.runtime_error,
        presentation_error:
          questoes[numPageAtual - 1].feedBackTest.presentation_error,
        wrong_answer: questoes[numPageAtual - 1].feedBackTest.wrong_answer,
        invalid_algorithm:
          questoes[numPageAtual - 1].feedBackTest.invalid_algorithm,
        teacherNote: questoes[numPageAtual - 1].feedBackTest.hitPercentage / 10,
      });
    }
    console.log("TESTE2");
    console.log(this.state.compilation_error);
    this.setState({
      title: questoes[numPageAtual - 1].title,
      description: questoes[numPageAtual - 1].description,
      katexDescription: questoes[numPageAtual - 1].katexDescription,
      solution: questoes[numPageAtual - 1].solution,
      difficulty: questoes[numPageAtual - 1].difficulty,
      feedBackTest: questoes[numPageAtual - 1].feedBackTest,
      results: [...questoes[numPageAtual - 1].results],

      response: [...questoes[numPageAtual - 1].results],
      question_id: questoes[numPageAtual - 1].id,
    });
    if (questoes[numPageAtual - 1].lastSubmission) {
      this.setState({
        answer: questoes[numPageAtual - 1].lastSubmission.answer,
        language: questoes[numPageAtual - 1].lastSubmission.language,
        percentualAcerto:
          questoes[numPageAtual - 1].lastSubmission.hitPercentage,
      });
    }
    if (questoes[numPageAtual - 1].feedBackTest) {
      this.setState({ notaProfessor: questoes[numPageAtual - 1].feedBackTest });
    }
    this.setState({ loadingQuestion: false });
  }

  //Mostra a questao em tela
  ShowQuestion() {
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
    console.log("HAHAHAHAHAHAHA");
    console.log(this.state.compilation_error);
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
    if (this.state.wrong_answer) {
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
  funcTeacherNote(e) {
    this.setState({
      teacherNote: e.target.value,
    });
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
    const proxPage = parseInt(numPageAtual) + 1;
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
    };
    try {
      await api.post("/feedBacksTest/store", requestInfo);
      if (!msg && numPageAtual < questoes.length) {
        await window.location.replace(
          `/professor/turma/${idTurma}/prova/${idProva}/aluno/${idAluno}/page:${proxPage}`
        );
      } else {
        Swal.fire({
          type: "success",
          title: "Feedback Salvo com sucesso",
        });
        await window.location.replace(
          `/professor/turma/${idTurma}/correcaoprovas/${idProva}`
        );
      }
    } catch (err) {
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
      console.log("Questoes do aluno");
      console.log(response.data);
      this.setState({
        questoes: [...response.data],
        loadingQuestoes: false,
      });
    } catch (err) {
      this.setState({ loadingQuestoes: false });
      console.log(err);
    }
    this.state.totalPages = this.state.questoes.length;
  }

  //funcao usada no componente de navegação de paginas
  /*handlePage(e, numPage) {
    console.log(numPage);
    this.setState({
      numPageAtual: numPage,
    });
    this.currentQuestion();
    this.ShowQuestion();
    console.log("Questao da pagina");
    console.log(this.state.questoes[this.state.numPageAtual - 1]);
  }*/

  //retorna a quantidade de paginas a patir da quantidade de questoes
  totalPages() {
    return this.state.questoes.length;
  }

  //funcao usada para a mudanca de linguegem no ambiente de programação
  async changeLanguage(e) {
    await this.setState({ language: e.target.value });
  }

  //função usada na mundança do tema no ambiente de programação
  async changeTheme(e) {
    await this.setState({ theme: e.target.value });
  }

  //função usada para executar o codigo(apenas executa)
  async submeter(e) {
    e.preventDefault();
    const timeConsuming = new Date() - this.state.tempo_inicial;
    const { answer, language, results, char_change_number } = this.state;
    const request = {
      codigo: answer,
      linguagem: language,
      results: results,
    };
    this.setState({ loadingReponse: true });
    try {
      const response = await apiCompiler.post("/apiCompiler", request);
      console.log("sumbissão: ");
      console.log(response.data);
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

  teste(i) {
    const { idTurma, idProva, idAluno, numQuestion } = this.state;
    window.location.replace(
      `/professor/turma/${idTurma}/prova/${idProva}/aluno/${idAluno}/page:${i}`
    );
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      totalPages,
      numPageAtual,
      idAluno,
      idTurma,
      idProva,
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
                <i className="fa fa-angle-left ml-2 mr-2" /> Provas
              </h5>
            )}
          </Col>
        </Row>
        {this.ShowQuestion()}
        <Row>
          <Col xs={12} textCenter>
            <NavPagination
              totalPages={this.totalPages()}
              pageAtual={numPageAtual}
              //handlePage={this.handlePage.bind(this)}
              idAluno={idAluno}
              numQuestion={numPageAtual}
              idTurma={idTurma}
              idProva={idProva}
              teste={this.teste.bind(this)}
            />
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}
