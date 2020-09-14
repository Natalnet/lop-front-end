import React, { Component } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import moment from "moment";
import {Load} from 'components/ui/load';
import { Pagination } from "components/ui/navs";

import SwalModal from "components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from "components/ui/tables/tableIO.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

const botao2 = {
  float: "right",
  backgroundColor: "red",
  borderColor: "red",
  color: "white",
};

export default class CriarProvaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: "",
      exercicios: [],
      selecionados: [],
      fildFilter: "title",
      title: "",
      password: "",
      showAllTestCases: false,
      loadQuestions: false,
      loadingTest: false,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      showModalInfo: false,
      question: "",
    };
  }

  async componentDidMount() {
    document.title = "Editar Prova - professor";
    await this.getQuestionsByTest();
    this.getQuestions();
  }

  async getQuestionsByTest() {
    const { id } = this.props.match.params;
    let query = `idTest=${id}`;
    this.setState({ loadQuestions: true });
    this.setState({loadingTest: true})
    try {
      const response = await api.get(`/question?${query}`);
      this.setState({
        title: response.data.test.title,
        selecionados: response.data.questions,
        password: response.data.test.password,
        showAllTestCases: response.data.test.showAllTestCases,
        loadingTest: false
      });
    } catch (err) {
      this.setState({loadingTest: false})

    }
  }
  async getQuestions() {
    let { contentInputSeach, numPageAtual, fildFilter } = this.state;
    let query = `?include=${contentInputSeach.trim()}`;
    query += `&field=${fildFilter}`;
    query += `&status=PÚBLICA PRIVADA`;

    try {
      this.setState({ loadQuestions: true });
      const response = await api.get(`/question/page/${numPageAtual}${query}`);
      this.setState({
        exercicios: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadQuestions: false,
      });
    } catch (err) {
      this.setState({ loadQuestions: false });
    }
  }

  async editTest(e) {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { title, selecionados, password, showAllTestCases } = this.state;
    let msg = "";
    msg += !title ? "Informe o título da turma<br/>" : "";
    msg +=
      selecionados.length === 0 ? "Escolha pelo menos um exercício<br/>" : "";
    if (msg) {
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar prova",
        html: msg,
      });
      return null;
    }
    const requestInfo = {
      title,
      questions: selecionados.map((q) => q.id),
      password,
      showAllTestCases

    };
    try {
      Swal.fire({
        title: "Editando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/test/${id}/update/questions`, requestInfo);
      
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova editada com sucesso!",
      });
      this.props.history.push("/professor/provas");
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar prova",
      });
      this.setState({ msg: "Erro: Não foi possivel salvar a prova" });
    }
  }
  selecionar(questao) {
    this.setState({
      selecionados: [...this.state.selecionados, questao],
    });
    //console.log(this.state.selecionados)
  }

  excluir(questao) {
    this.setState({
      selecionados: [...this.state.selecionados].filter(
        (q) => q.id !== questao.id
      ),
      //exercicios: [...this.state.exercicios,questao]
    });
  }
  handleShowModalInfo(question) {
    this.setState({
      question: question,
      showModalInfo: true,
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleshowAllTestCasesChange(e) {
    this.setState({ showAllTestCases: e.target.value });
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getQuestions()
    );
  }
  handleSelectfildFilter(e) {
    this.setState(
      {
        fildFilter: e.target.value,
      } /*,()=>this.getQuestions()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getQuestions()*/
    );
  }
  filterSeash() {
    this.getQuestions();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getQuestions()
    );
  }

  render() {
    const {
      loadQuestions,
      contentInputSeach,
      numPageAtual,
      totalPages,
      selecionados,
      question,
      showModalInfo,
      loadingTest
    } = this.state;

    return (
      <TemplateSistema active="provas">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>
              <Link to="/professor/provas">Provas</Link>
              <i className="fa fa-angle-left ml-2 mr-2" />
              Editar prova
            </h5>
          </Col>
        </Row>
        <Card>
          <CardBody>
            {loadingTest?
              <Load/>
            :
            <form onSubmit={(e) => this.editTest(e)} onKeyDown={e => {if (e.key === 'Enter') e.preventDefault();}}>
              <div className="form-row">
                <div className="form-group col-12 col-md-4 ">
                  <label htmlFor="inputTitulo">Título</label>
                  <input
                    id="inputTitulo"
                    type="text"
                    required
                    value={this.state.title}
                    onChange={(e) => this.handleTitleChange(e)}
                    className="form-control"
                    placeholder="Título da prova:"
                  />
                </div>
                <div className="form-group col-12 col-md-4">
                  <label htmlFor="inputSenha">Senha:</label>
                  <input
                    id="inputSenha"
                    type="text"
                    required
                    value={this.state.password}
                    onChange={(e) => this.handlePasswordChange(e)}
                    className="form-control"
                    placeholder="Senha para abrir a prova"
                  />
                </div>
                <div className="form-group col-12 col-md-4">
                  <label htmlFor="select">Casos de teste</label>
                  <select
                    id="select"
                    defaultValue={this.state.showAllTestCases}
                    onChange={(e) => this.handleshowAllTestCasesChange(e)}
                    className="form-control"
                  >
                    <option value={false}>Mostrar apenas primeiro</option>
                    <option value={true}>Mostrar todos</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <InputGroupo
                    placeholder={`Perquise...`}
                    loading={loadingTest || loadQuestions}
                    value={contentInputSeach}
                    handleContentInputSeach={this.handleContentInputSeach.bind(
                      this
                    )}
                    filterSeash={this.filterSeash.bind(this)}
                    handleSelect={this.handleSelectfildFilter.bind(this)}
                    options={[
                      { value: "title", content: "Nome" },
                      { value: "code", content: "Código" },
                    ]}
                    clearContentInputSeach={this.clearContentInputSeach.bind(
                      this
                    )}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <table
                    className="table table-hover"
                    style={{ borderTopRightRadius: "10%", marginBottom: "0px" }}
                  >
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Código</th>
                        <th>Submissões gerais (corretas/total)</th>
                        <th>Criado por</th>
                        <th>Criado em</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadQuestions ? (
                        <tr>
                          <td>
                            <div className="loader" />
                          </td>
                          <td>
                            <div className="loader" />
                          </td>
                          <td>
                            <div className="loader" />
                          </td>
                          <td>
                            <div className="loader" />
                          </td>
                          <td>
                            <div className="loader" />
                          </td>
                        </tr>
                      ) : (
                        this.state.exercicios.map((questao) => {
                          return (
                            <tr key={questao.id}>
                              <td>{questao.title}</td>
                              <td>{questao.code}</td>
                              <td>{`(${questao.submissionsCorrectsCount}/${questao.submissionsCount})`}</td>
                              <td>{questao.author.email}</td>
                              <td>{moment(questao.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                              <td className="d-inline-flex">
                                <button
                                  type="button"
                                  className="btn btn-primary mr-2"
                                  onClick={() =>
                                    this.handleShowModalInfo(questao)
                                  }
                                >
                                  <i className="fa fa-info" />
                                </button>
                                {selecionados
                                  .map((s) => s.id)
                                  .includes(questao.id) ? (
                                  <button
                                    type="button"
                                    className="float-right btn  btn-indigo disabled"
                                  >
                                    Selecionada
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="float-right btn  btn-primary"
                                    onClick={(e) => this.selecionar(questao)}
                                  >
                                    Adicionar <i className="fe fe-file-plus" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Row>
                <Col xs={12} textCenter>
                  <Pagination 
                    count={totalPages} 
                    page={Number(numPageAtual)} 
                    onChange={this.handlePage.bind(this)} 
                    color="primary" 
                    size="large"
                    disabled={loadQuestions}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs={12} textCenter>
                  <label>Selecionadas</label>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Código</th>
                        <th>Submissões gerais (corretas/total)</th>
                        <th>Criado por</th>
                        <th>Criado em</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selecionados.map((questao, index) => (
                        <tr key={index}>
                          <td>{questao.title}</td>
                          <td>{questao.code}</td>
                          <td>{`(${questao.submissionsCorrectsCount}/${questao.submissionsCount})`}</td>
                          <td>{questao.author.email}</td>
                          <td>{moment(questao.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={botao2}
                              onClick={() => this.excluir(questao)}
                            >
                              <i className="fe fe-file-minus" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row>
                <Col xs={12} textCenter>
                  <button
                    type="submit"
                    className={`btn btn-primary float-right col-3 ${
                      loadQuestions || loadingTest ? "btn-loading" : ""
                    }`}                    
                    style={{ width: "100%" }}
                  >
                    Editar Prova
                  </button>
                </Col>
              </Row>
            </form>
            }
         </CardBody>

          <SwalModal
            show={showModalInfo}
            title="Exercício"
            handleModal={this.handleCloseshowModalInfo.bind(this)}
            width={"90%"}
          >
            <Card>
              <CardHead>
                <CardTitle>{question.title}</CardTitle>
              </CardHead>
              <CardBody>
                <Row>
                  <b>Descrição: </b>
                </Row>
                <Row>
                  <span style={{ overflow: "auto" }}>
                    {/* <HTMLFormat>{question && question.description}</HTMLFormat> */}
                    {question && 
                      <SunEditor 
                        lang="pt_br"
                        height="auto"
                        disable={true}
                        showToolbar={false}
                        // onChange={this.handleDescriptionChange.bind(this)}
                        setContents={question.description}
                        setDefaultStyle="font-size: 15px; text-align: justify"
                        setOptions={{
                            toolbarContainer : '#toolbar_container',
                            resizingBar : false,
                            katex: katex,
                        }}
                      />
                    }
                  </span>
                </Row>
                <Row>
                  <Col xs={12} textCenter>
                    <BlockMath>{question.katexDescription || ""}</BlockMath>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <TableIO results={question.results || []} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </SwalModal>
        </Card>
      </TemplateSistema>
    );
  }
}
