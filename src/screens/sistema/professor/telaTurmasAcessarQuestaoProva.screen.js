import React, { Component, Fragment, createRef } from "react";
//import PropTypes from "prop-types";
import api from "../../../services/api";
import findLocalIp from "../../../util/funçoesAuxiliares/findLocalIp";
import { Link } from "react-router-dom";
import HTMLFormat from "../../../components/ui/htmlFormat";
import Swal from "sweetalert2";
import apiCompiler from "../../../services/apiCompiler";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/github";
import "brace/theme/tomorrow";
import "brace/theme/kuroir";
import "brace/theme/twilight";
import "brace/theme/xcode";
import "brace/theme/textmate";
import "brace/theme/solarized_dark";
import "brace/theme/solarized_light";
import "brace/theme/terminal";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import TableResults2 from "../../../components/ui/tables/tableResults2.component";
import { BlockMath } from "react-katex";
import FormSelect from "../../../components/ui/forms/formSelect.component";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props) {
    super(props);
    this.state = {
      editor: "",
      editorRes: "",
      descriptionErro: "",
      language: "javascript",
      theme: "monokai",
      response: [],
      katexDescription: "",
      status: "PÚBLICA",
      difficulty: "Médio",
      solution: "",
      results: [],
      tempo_inicial: null,
      loadingReponse: false,
      loadingEditor: false,
      title: "",
      description: "",
      inputs: "",
      outputs: "",
      percentualAcerto: "",
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",        
      loadingInfoTurma: true,
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      salvandoRascunho: false,
      char_change_number: 0
    };
    this.cardEnunciadoRef = createRef();
    this.cardExemplos = createRef();
  }

  async componentDidMount() {
    this.setState({ tempo_inicial: new Date() });
    await this.getInfoTurma();
    await this.getExercicio();
    this.salvaAcesso();
    this.appStyles();
    document.title = `${this.state.title}`;
    //salva rascunho a cada 1 minuto
    setInterval(
      function() {
        this.salvaRascunho(false);
      }.bind(this),
      60000
    );
  }
  appStyles() {
    const cardEnunciado = this.cardEnunciadoRef.current;
    const cardExemplos = this.cardExemplos.current;
    const heightCardEnunciado = cardEnunciado && cardEnunciado.offsetHeight;
    const heightCardExemplos = cardExemplos && cardExemplos.offsetHeight;
    if (heightCardEnunciado > heightCardExemplos) {
      cardEnunciado &&
        cardEnunciado.setAttribute("style", `height:${heightCardEnunciado}px`);
      cardExemplos &&
        cardExemplos.setAttribute("style", `height:${heightCardEnunciado}px`);
    } else {
      cardEnunciado &&
        cardEnunciado.setAttribute("style", `height:${heightCardExemplos}px`);
      cardExemplos &&
        cardExemplos.setAttribute("style", `height:${heightCardExemplos}px`);
    }
  }
  async salvaAcesso() {
    const ip = await findLocalIp(false);
    const idQuestion = this.props.match.params.idExercicio;
    const request = {
      ip: ip[0],
      environment: "desktop",
      idQuestion
    };
    try {
      await api.post(`/access/store`, request);
    } catch (err) {
      console.log(err);
    }
  }
  async getInfoTurma(){
    const id = this.props.match.params.id
    const {myClasses} = this.state
    if(myClasses && typeof myClasses==="object"){
        const index = myClasses.map(c=>c.id).indexOf(id)
        if(index!==-1){
            this.setState({
                turma:myClasses[index]
            })
        }
        this.setState({loadingInfoTurma:false})
        return null
    }
    try{
        const response = await api.get(`/class/${id}`)
        this.setState({
            turma:response.data,
            loadingInfoTurma:false,
        })
    }
    catch(err){
        this.setState({loadingInfoTurma:false})
        console.log(err);
    }
  }
  async getExercicio() {
    const {id,idTest,idExercicio} = this.props.match.params;
    let query = `?exclude=solution`
    query += `&draft=yes`
    query += `&idClass=${id}`
    query += `&idTest=${idTest}`
    query += `&difficulty=yes`
    try {
      const response = await api.get(`/question/${idExercicio}${query}`);
      console.log("questão");
      console.log(response.data);
      this.setState({
        results: [...response.data.results],
        title: response.data.title,
        description: response.data.description,
        katexDescription: response.data.katexDescription || "",
        difficulty: response.data.difficulty,
        userDifficulty: response.data.userDifficulty || "",
        solution: response.data.questionDraft?response.data.questionDraft.answer:'',
        char_change_number:response.data.questionDraft?response.data.questionDraft.char_change_number:0,
        loadingExercicio: false,
      });
    } catch (err) {
      this.setState({ loadingExercicio: false });
    }
  }
  async salvaRascunho(showMsg = true) {
    const {id,idTest,idExercicio} = this.props.match.params;
    const {solution,char_change_number} = this.state
    const request = {
      answer: solution,
      char_change_number,
      idQuestion : idExercicio,
      idTest : idTest,
      idClass : id
    };
    try {
      this.setState({ salvandoRascunho: true });
      await api.post(`/draft/store`, request);
      this.setState({ salvandoRascunho: false });
      if (showMsg) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: "success",
          title: "Rascunho salvo com sucesso!"
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ salvandoRascunho: false });
    }
  }
  async submeter(e) {
    e.preventDefault();
    const timeConsuming = new Date() - this.state.tempo_inicial;
    const { solution, language, results, char_change_number } = this.state;
    console.log("solution:");
    console.log(solution);
    const request = {
      codigo: solution,
      linguagem: language,
      results: results
    };
    console.log("codigo aparado");
    console.log(request.codigo);
    this.setState({ loadingReponse: true });
    try {
      this.salvaRascunho();
      const response = await apiCompiler.post("/submission/exec", request);
      this.saveSubmission(
        request,
        response.data.percentualAcerto,
        timeConsuming,
        char_change_number
      );
      console.log("sumbissão: ");
      console.log(response.data);
      this.setState({
        loadingReponse: false,
        response: response.data.results,
        percentualAcerto: response.data.percentualAcerto,
        descriptionErro: response.data.descriptionErro
      });
    } catch (err) {
      Object.getOwnPropertyDescriptors(err);
      this.setState({ loadingReponse: false });
      alert("erro na conexão com o servidor");
    }
  }
  async saveSubmission(
    { codigo, linguagem },
    hitPercentage,
    timeConsuming,
    char_change_number
  ) {
    const {id,idTest,idExercicio} = this.props.match.params;

    try {
      const ip = await findLocalIp(false);
      console.log(ip);
      const request = {
        answer: codigo,
        language: linguagem,
        hitPercentage: hitPercentage,
        timeConsuming: timeConsuming,
        ip: ip[0],
        environment: "desktop",
        char_change_number,
        idQuestion:idExercicio,
        idClass:id,
        idTest:idTest,
      };
      await api.post(`/submission/store`,request);

      this.setState({ tempo_inicial: new Date() });
    } catch (err) {
      this.setState({ tempo_inicial: new Date() });
      console.log(err);
    }
  }

  async changeLanguage(e) {
    await this.setState({ language: e.target.value });
  }
  async changeTheme(e) {
    await this.setState({ theme: e.target.value });
  }
  handleSolution(newValue) {
    this.setState({
      solution: newValue,
      char_change_number: this.state.char_change_number + 1
    });
  }
  async handleDifficulty(e) {
    const userDifficulty = e.target ? e.target.value : "";
    const idQuestion = this.props.match.params.idExercicio;
    const request = {
      userDifficulty: userDifficulty,
      idQuestion
    };
    try {
      this.setState({ loadDifficulty: true });
      await api.post(`/difficulty/store`,request);
      this.setState({
        userDifficulty: userDifficulty,
        loadDifficulty: false
      });
    } catch (err) {
      this.setState({ loadDifficulty: false });
      console.log(err);
    }
  }

  render() {
    const {
      turma,
      response,
      percentualAcerto,
      loadingReponse,
      title,
      description,
      results,
      katexDescription
    } = this.state;
    const {
      language,
      theme,
      descriptionErro,
      solution,
      loadingExercicio,
      loadingInfoTurma,
      userDifficulty,
      loadDifficulty,
      salvandoRascunho
    } = this.state;

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
        {loadingExercicio ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={15}>
              <Col xs={12}>
                {console.log("akii")}
                {console.log(this.props.match.params)}
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/prova/${this.props.match.params.idTest}`}
                >
                  <button className="btn btn-success mr-2">
                    <i className="fa fa-arrow-left" /> Voltar para as questões{" "}
                    <i className="fa fa-file-text" />
                  </button>
                </Link>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <Card ref={this.cardEnunciadoRef}>
                  <CardHead>
                    <CardTitle>
                      <b>{title}</b>
                    </CardTitle>
                  </CardHead>
                  <CardBody>
                    <Row>{description}</Row>
                    {katexDescription ? (
                      <BlockMath>{katexDescription}</BlockMath>
                    ) : (
                      ""
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} md={5}>
                <Card ref={this.cardExemplos}>
                  <CardHead>
                    <CardTitle>Exemplos</CardTitle>
                  </CardHead>
                  <CardBody>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <b>Exemplo de entrada</b>
                          </td>
                          <td>
                            <b>Exemplo de saída</b>
                          </td>
                        </tr>
                        {results
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
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row mb={10}>
              <FormSelect
                loadingReponse={loadingReponse}
                languages={this.state.turma.languages}
                changeLanguage={this.changeLanguage.bind(this)}
                changeTheme={this.changeTheme.bind(this)}
                executar={this.submeter.bind(this)}
              />

              <Col xs={5} md={3}>
                <label htmlFor="rascunho">&nbsp;</label>
                <button
                  style={{ width: "100%" }}
                  className={`btn btn-azure ${salvandoRascunho &&
                    "btn-loading"}`}
                  onClick={() => this.salvaRascunho()}
                >
                  <i className="fa fa-floppy-o" />
                  &nbsp;&nbsp; Salvar rascunho
                </button>
              </Col>
              <Col xs={5} md={2}>
                <label htmlFor="selectDifficulty">Dificuldade: </label>
                <select
                  defaultValue={userDifficulty}
                  className="form-control"
                  id="selectDifficulty"
                  disabled={loadDifficulty ? "disabled" : ""}
                  onChange={e => this.handleDifficulty(e)}
                >
                  <option value={""}></option>
                  <option value="Muito fácil">Muito fácil</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                  <option value="Muito difícil">Muito difícil</option>
                </select>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <Card>
                  <AceEditor
                    mode={language === "cpp" ? "c_cpp" : language}
                    theme={theme}
                    focus={false}
                    onChange={this.handleSolution.bind(this)}
                    value={solution}
                    fontSize={14}
                    width="100%"
                    showPrintMargin={false}
                    name="ACE_EDITOR"
                    showGutter={true}
                     
                     
                    highlightActiveLine={true}
                  />
                </Card>
              </Col>
              <Col xs={12} md={5}>
                {loadingReponse ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <Card style={{ minHeight: "500px" }}>
                    <CardHead>
                      <CardTitle>Resultados</CardTitle>
                    </CardHead>
                    <TableResults2
                      response={response}
                      showAllTestCases={true}
                      descriptionErro={descriptionErro}
                      percentualAcerto={percentualAcerto}
                    />
                  </Card>
                )}
              </Col>
            </Row>
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
