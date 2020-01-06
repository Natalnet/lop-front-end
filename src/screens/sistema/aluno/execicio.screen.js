import React, { Component, Fragment, createRef } from "react";
//import PropTypes from "prop-types";
import {findLocalIp} from "../../../util/auxiliaryFunctions.util";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import HTMLFormat from "../../../components/ui/htmlFormat";
import apiCompiler from "../../../services/apiCompiler";
import { BlockMath } from "react-katex";
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
      difficulty: null,
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
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      salvandoRascunho: false,
      char_change_number:0,
    };
    this.cardEnunciadoRef = createRef();
    this.cardExemplos = createRef();
  }

  async componentDidMount() {
    this.setState({ tempo_inicial: new Date() });
    
    await this.getExercicio();
    this.salvaAcesso()
    this.appStyles();
    document.title = `${this.state.title}`;
    //salva rascunho a cada 1 minuto
    this.time = setInterval(function() {
        this.salvaRascunho(false);
    }.bind(this),60000);
  }
  componentWillUnmount(){
    clearInterval(this.time)
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
  async salvaAcesso(){
    const ip = await findLocalIp(false);
    const idQuestion = this.props.match.params.id;
    const request = {
      ip : ip[0],
      environment:'desktop',
      idQuestion,
    }
    try{
      await api.post(`/access/store`,request)
    }
    catch(err){
      console.log(err);
    }
  }
  async getExercicio() {
    const idQuestion = this.props.match.params.id;
    let query = `?exclude=id code status createdAt updatedAt author_id solution`;
    query += `&draft=yes`
    query += `&difficulty=yes`
    try {
      const response = await api.get(`/question/${idQuestion}${query}`);
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
      console.log(err);
      //this.setState({ loadingExercicio: false });
    }
  }
  async salvaRascunho(showMsg = true) {
    const idQuestion = this.props.match.params.id;
    const {solution,char_change_number} = this.state
    const request = {
      answer: solution,
      char_change_number,
      idQuestion,
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
    const { solution, language, results,char_change_number } = this.state;
    const request = {
      codigo: solution,
      linguagem: language,
      results: results,
    };
    this.setState({ loadingReponse: true });
    try {
      this.salvaRascunho();
      const response = await apiCompiler.post("/apiCompiler", request);
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
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({ loadingReponse: false });
      Swal.fire({
        type: 'error',
        title: 'ops... Algum erro aconteceu na operação :(',
      })
      console.log(err);    
    }
  }

  async saveSubmission({ codigo, linguagem }, hitPercentage, timeConsuming,char_change_number) {
    const idQuestion = this.props.match.params.id;
    try {
      const ip = await findLocalIp(false);
      console.log("local ips:");
      console.log(ip);
      const request = {
        answer: codigo,
        language: linguagem,
        hitPercentage: hitPercentage,
        timeConsuming: timeConsuming,
        ip: ip[0],
        environment: "desktop",
        char_change_number,
        idQuestion,
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
      char_change_number:this.state.char_change_number+1,
    });
  }
  async handleDifficulty(e) {
    const userDifficulty = e.target ? e.target.value : "";
    const idQuestion = this.props.match.params.id;
    const request = {
      userDifficulty: userDifficulty,
      idQuestion
    };
    try {
      this.setState({ loadDifficulty: true });
      await api.post(`/difficulty/store`, request);
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
      userDifficulty,
      loadDifficulty,
      salvandoRascunho
    } = this.state;
    return (
      <TemplateSistema active="exercicios">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{margin:'0px'}}>
              <Link to="/aluno/exercicios">
                Exercícios
              </Link>
              <i className="fa fa-angle-left ml-2 mr-2"/> 
              {title || <div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
            </h5>
          </Col>
        </Row>
        {loadingExercicio ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
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
                  defaultValue = {userDifficulty}
                  className="form-control"
                  id="selectDifficulty"
                  disabled={loadDifficulty ? "disabled" : ""}
                  onChange={e => this.handleDifficulty(e)}
                >
                  <option value={""}></option>
                  <option value = '1' >Muito fácil</option>
                  <option value = '2' >Fácil</option>
                  <option value = '3' >Médio</option>
                  <option value = '4' >Difícil</option>
                  <option value = '5' >Muito difícil</option>
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
