import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import apiCompiler from "../../../services/apiCompiler";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import Swal from "sweetalert2";
import AceEditorWrapper from "../../../components/templates/aceEditorWrapper.template";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import TableResults2 from "../../../components/ui/tables/tableResults2.component";
import TableIO from "../../../components/ui/tables/tableIO.component";
import Select from "react-select";
import "katex/dist/katex.min.css";
import FormSelect2 from "../../../components/ui/forms/formSelect2.component";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import * as B from "../../../components/ui/blockly";
import { getBlocklyCode, getBlocklyXML, isXml } from '../../../util/auxiliaryFunctions.util'
import SupportedLanguages from "../../../config/SupportedLanguages";

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: "",
      editorRes: "",
      descriptionErro: "",
      contentRes: "",
      language: SupportedLanguages.list[0],
      theme: "monokai",
      response: [],
      //katexDescription: "",
      status: "PÚBLICA",
      difficulty: "3",
      solution: "",
      loadingReponse: false,
      savingQuestion: false,
      loadingEditor: false,
      title: "",
      description: "",
      tests: [
        {
          inputs: "",
          output: "",
          msgInputs: "",
          msgOutput: "",
        },
      ],
      msgTitle: "",
      msgDescription: "",
      percentualAcerto: "",
      tags: [],
      tagsSelecionadas: [],
      loadingTags: false,
    };
  }
  componentDidMount() {
    this.simpleWorkspace = React.createRef();
    document.title = "Editar Exercício - professor";
    this.getTags();
    this.getExercicio();
  }
  async getTags() {
    try {
      this.setState({ loadingTags: true });
      const response = await api.get("/tag");
      this.setState({
        tags: response.data.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        }),
        loadingTags: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ loadingTags: false });
    }
  }
  async getExercicio() {
    const id = this.props.match.params.id;
    try {
      this.setState({ loadingExercicio: true });
      const response = await api.get(`/question/${id}`);
      //console.log(response.data);
      this.setState({
        title: response.data.title,
        description: response.data.description,
        //katexDescription: response.data.katexDescription || "",
        tests: this.appInputFormat(response.data.results),
        status: response.data.status,
        difficulty: response.data.difficulty,
        solution: response.data.solution,
        loadingExercicio: false,
        tagsSelecionadas: response.data.tags.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        }),
      });
    } catch (err) {
      this.setState({ loadingExercicio: false });
      console.log(Object.getOwnPropertyDescriptors(err));
    }
  }
  handleNumTest(action) {
    let { tests } = this.state;
    if (action === "+") {
      tests = [
        ...tests,
        {
          inputs: "",
          output: "",
          msgInputs: "",
          msgOutput: "",
        },
      ];
    } else {
      if (tests.length === 1) return null;
      else {
        tests.pop();
      }
    }
    this.setState({
      tests: [...tests],
    });
  }
  async handleTagsChangeTags(tags) {
    this.setState({
      tagsSelecionadas: tags || [],
    });
  }
  async handleTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }
  async handleDescriptionChange(content) {
    this.setState({
      description: content,
    });
  }
  handleImageUploadBefore() {
    Swal.fire({
      type: "error",
      title: "Não é permitido o upload de imagens, carregue-as a partir de um link 😃",
    });
    return false;
  }
  handleVideoUploadBefore() {
    Swal.fire({
      type: "error",
      title: "Não é permitido o upload de vídeos, carregue-os a partir de um link 😃",
    });
    return false;
  }

  async handleStatus(e) {
    this.setState({ status: e.target.value });
  }
  async handleDifficulty(e) {
    this.setState({
      difficulty: e.target.value,
    });
  }
  handleInputsChange(e, i) {
    const inputs = e.target.value;
    const { tests } = this.state;
    tests[i].inputs = inputs;
    this.setState({ tests: tests });
  }
  handleOutputChange(e, i) {
    const output = e.target.value;
    const { tests } = this.state;
    tests[i].output = output;
    this.setState({ tests: tests });
  }
  async changeLanguage(e) {
    await this.setState({ language: e.target.value });
  }
  async changeTheme(e) {
    await this.setState({ theme: e.target.value });
  }
  handleSolution(newValue) {
    this.setState({ solution: newValue });
  }
  isTestEmpty(results) {
    let isTestEmpty = false;
    const testsChecked = results.map((test) => {
      //if (/*!test.inputs || */!test.output) isTestEmpty = true;
      return {
        inputs: test.inputs.replace(/\s+$/, ""),
        output: test.output.replace(/\s+$/, "").replace(/\n+$/, ""),
        //msgInputs: !test.inputs ? "Este campo é obrigatório" : "",
        //msgOutput: !test.output ? "Este campo é obrigatório" : "",
      };
    });
    this.setState({ tests: testsChecked });
    return isTestEmpty;
  }

  async executar(e) {
    e.preventDefault();
    let { tests, solution, language } = this.state;
    if (this.isTestEmpty(tests)) return null;
    const results = this.rTrimAll(tests);
    const request = {
      codigo: language === "blockly" ? getBlocklyCode(this.simpleWorkspace.current.workspace) : solution,
      linguagem: language === "blockly" ? 'python' : language,
      results,
    };

    try {
      this.setState({ loadingReponse: true });
      const response = await apiCompiler.post("/apiCompiler", request);
      this.setState({ loadingReponse: false });
      if (response.status === 200) {
        this.setState({
          response: response.data.results,
          percentualAcerto: response.data.percentualAcerto,
          descriptionErro: response.data.descriptionErro,
        });
      }
    } catch (err) {
      Object.getOwnPropertyDescriptors(err);
      this.setState({ loadingReponse: false });
      Swal.fire({
        type: "error",
        title: "ops... Algum erro aconteceu na operação :(",
      });
    }
  }
  appInputFormat(tests) {
    return tests.map((test) => {
      return {
        inputs: test.inputs.split("\n").join("\\n"),
        output: test.output,
        msgInputs: "",
        msgOutput: "",
      };
    });
  }
  rTrimAll(tests) {
    /*console.log('antes do Rtrim');
    console.log(tests);*/
    const results = tests.map((test) => {
      return {
        inputs: test.inputs
          .split("\\n")
          .map((test) => test.replace(/\s+$/, ""))
          .join("\n"),
        output: test.output
          .split("\\n")
          .join("\n")
          .replace(/\s+$/, "")
          .replace(/\n+$/, ""),
      };
    });
    /*console.log('depois do em RTrim');
    console.log(results);*/
    return results;
  }
  async updateQuestion(e) {
    const id = this.props.match.params.id;
    e.preventDefault();
    let {
      tests,
      title,
      description,
      tagsSelecionadas,
      solution,
      status,
      language,
      difficulty,
      //katexDescription,
    } = this.state;
    if (this.isTestEmpty(tests)) return null;
    if (!tagsSelecionadas.length) {
      Swal.fire({
        type: "error",
        title: "Adicione pelo menos uma tag ao exercício!",
      });
      return;
    }
    if (!description) {
      Swal.fire({
        type: "error",
        title: "ops... Adicione uma descrição para a questão!",
      });
      return;
    }
    const results = this.rTrimAll(tests);
    Swal.fire({
      title: "Atualizando questão",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    Swal.showLoading();

    const request = {
      title,
      description,
      tags: tagsSelecionadas.map((tag) => tag.value),
      //katexDescription,
      status,
      difficulty,
      solution: language === "blockly" ? getBlocklyXML(this.simpleWorkspace.current.workspace) : solution,
      results,
    };
    try {
      this.setState({ savingQuestion: true });
      await api.put(`/question/update/${id}`, request);

      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Questão atualizada com sucesso!",
      });
      this.setState({
        savingQuestion: false,
      });
      this.props.history.push("/professor/exercicios");
    } catch (err) {
      await this.setState({
        msgTitle: "",
        msgDescription: "",
      });
      console.log(Object.getOwnPropertyDescriptors(err));
      if (err.response && err.response.status === 400) {
        for (let fieldErro of err.response.data) {
          if (fieldErro.field === "title") {
            this.setState({ msgTitle: fieldErro.msg });
          }
          if (fieldErro.field === "description") {
            this.setState({ msgDescription: fieldErro.msg });
          }
        }
      }
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Questão não pôde ser salva",
      });
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Questão não pôde ser atualizada",
      });
      this.setState({ savingQuestion: false });
      console.log(Object.getOwnPropertyDescriptors(err));
    }
  }

  render() {
    const {
      percentualAcerto,
      response,
      status,
      difficulty,
      //katexDescription,
      savingQuestion,
      loadingReponse,
      title,
      description,
    } = this.state;
    const {
      tests,
      language,
      theme,
      solution,
      loadingExercicio,
      tags,
      tagsSelecionadas,
      loadingTags,
      msgTitle,
      msgDescription,
      descriptionErro,
    } = this.state;
    return (
      <TemplateSistema active="exercicios">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>
              <Link to="/professor/exercicios">Exercícios</Link>
              <i className="fa fa-angle-left ml-2 mr-2" />
              Editar Exercício
            </h5>
          </Col>
        </Row>
        <Card>
          <CardBody loading={loadingExercicio || loadingTags}>
            <form onSubmit={(e) => { e.preventDefault(); this.updateQuestion(e) }}>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label>Título: </label>
                  <input
                    type="text"
                    onChange={(e) => this.handleTitleChange(e)}
                    className={`form-control ${msgTitle && "is-invalid"}`}
                    placeholder="Digite o título da questão..."
                    value={title}
                    required
                  />
                  <div className="invalid-feedback">{msgTitle}</div>
                </div>
                <div className="form-group col-md-12">
                  <label>Enunciado:</label>
                  <SunEditor
                    lang="pt_br"
                    height = 'auto'
                    minHeight="250px"
                    height="auto"
                    // disable={true}
                    // showToolbar={false}
                    onChange={this.handleDescriptionChange.bind(this)}
                    setContents={description}
                    onImageUploadBefore={this.handleImageUploadBefore.bind(this)}
                    onVideoUploadBefore={this.handleVideoUploadBefore.bind(this)}
                    setDefaultStyle="font-size: 15px; text-align: justify"
                    setOptions={{
                      toolbarContainer: '#toolbar_container',
                      // resizingBar : false,
                      //charCounter : true,
                      //maxCharCount : 720,
                      katex: katex,
                      buttonList: [
                        ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat', 'textStyle', 'paragraphStyle'],
                        ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table', 'codeView', 'math'],
                        ['link', 'image', 'video', 'audio', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save']
                      ],
                    }}
                  />
                  {/* <textarea
                    onChange={(e) => this.handleDescriptionChange(e)}
                    style={{ height: "150px" }}
                    className={`form-control ${msgDescription && "is-invalid"}`}
                    value={description}
                    required
                  ></textarea> */}
                  <div className="invalid-feedback">{msgDescription}</div>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="selectStatus">Status da questão: </label>
                  <select
                    className="form-control"
                    defaultValue={status}
                    id="selectStatus"
                    onChange={(e) => this.handleStatus(e)}
                  >
                    <option value="PÚBLICA">
                      Pública (para uso em listas)
                    </option>
                    <option value="PRIVADA">Oculta (para uso em provas)</option>
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="selectDifficulty">Dificuldade </label>
                  <select
                    className="form-control"
                    defaultValue={difficulty}
                    id="selectDifficulty"
                    onChange={(e) => this.handleDifficulty(e)}
                  >
                    <option value="1">Muito fácil</option>
                    <option value="2">Fácil</option>
                    <option value="3">Médio</option>
                    <option value="4">Difícil</option>
                    <option value="5">Muito difícil</option>
                  </select>
                </div>
                <div className="form-group col-12">
                  <label>Tags </label>
                  <Select
                    style={{ boxShadow: "white" }}
                    defaultValue={tagsSelecionadas}
                    options={tags || []}
                    isMulti
                    isLoading={loadingTags}
                    closeMenuOnSelect={false}
                    onChange={this.handleTagsChangeTags.bind(this)}
                  />
                </div>
                <div className="form-group col-md-12">
                  <label className="mr-2">Entradas para testes: </label>
                  <button
                    onClick={() => this.handleNumTest("+")}
                    type="button"
                    className="btn btn-primary btn-sm mr-2"
                  >
                    <i className="fe fe-plus" />
                  </button>
                  <button
                    onClick={() => this.handleNumTest("-")}
                    type="button"
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fe fe-minus" />
                  </button>
                </div>
                {tests.map((test, i) => {
                  return (
                    <Fragment key={i}>
                      <div
                        className="form-group col-12 col-md-6"
                        style={{ border: "1px solid #467fcf" }}
                      >
                        <div className="form-group col-12">
                          <label>teste {i + 1}</label>
                        </div>
                        <div className="form-group col-12">
                          <label>
                            entrada(s) (cada entrada deve vir acompanahada de um
                            \n)
                          </label>
                          <input
                            type="text"
                            onChange={(e) => this.handleInputsChange(e, i)}
                            className={`form-control ${!tests[i].inputs && tests[i].msgInputs
                                ? "is-invalid"
                                : ""
                              }`}
                            placeholder="Ex: 12\n16.4\nOlá mundo!\n"
                            value={tests[i].inputs}
                          //required
                          />
                          <div className="invalid-feedback">
                            {!tests[i].inputs && tests[i].msgInputs
                              ? tests[i].msgInputs
                              : ""}
                          </div>
                        </div>
                        <div className="form-group col-12">
                          <label>saída</label>
                          <textarea
                            onChange={(e) => this.handleOutputChange(e, i)}
                            style={{
                              minHeight: "38px",
                              height: "90px",
                              width: "100%",
                            }}
                            className={`form-control ${!tests[i].output && tests[i].msgOutput
                                ? "is-invalid"
                                : ""
                              }`}
                            wrap="off"
                            placeholder="EX1: 34.89; EX2: Eh maior"
                            value={tests[i].output}

                          ></textarea>
                          <div className="invalid-feedback">
                            {!tests[i].output && tests[i].msgOutput
                              ? tests[i].msgOutput
                              : ""}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
              <div className="row">
                <div className="card col-12">
                  <TableIO results={this.rTrimAll(tests)} />
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <FormSelect2
                  loadingReponse={loadingReponse}
                  changeLanguage={this.changeLanguage.bind(this)}
                  changeTheme={this.changeTheme.bind(this)}
                  executar={this.executar.bind(this)}
                />
              </div>
              <div className="row">
                <div className="col-12">
                  {language === 'blockly' ?
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
                      initialXml={isXml(solution)? solution:''}>
                      <B.Category name="Texto" colour="20">
                        {/* <B.Block type="variables_get" />
                          <B.Block type="variables_set" /> */}
                        <B.Block type="text" />
                        <B.Block type="text_print" />
                        <B.Block type="text_prompt" />
                        {/* <B.Block type="string_length" /> */}
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
                      onChange={this.handleSolution.bind(this)}
                      value={solution}
                      fontSize={14}
                      width="100%"
                      name="ACE_EDITOR"
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      setOptions={{
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}

                    />

                  }
                </div>

                <div className="col-12">
                  {loadingReponse ? (
                    <div
                      className="loader"
                      style={{ margin: "0px auto" }}
                    ></div>
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
                </div>
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-lg btn-block mt-5 ${savingQuestion && "btn-loading"
                  }`}
              >
                <i className="fa fa-save"></i> Salvar
              </button>
            </form>
          </CardBody>
        </Card>
      </TemplateSistema>
    );
  }
}
