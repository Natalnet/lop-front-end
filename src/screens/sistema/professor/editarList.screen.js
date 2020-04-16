import React, { Component } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import {formatDate} from "../../../util/auxiliaryFunctions.util";
import NavPagination from "components/ui/navs/navPagination";
import SwalModal from "components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from 'components/ui/tables/tableIO.component'
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
  color: "white"
};

export default class CriarListaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: "",
      exercicios: [],
      selecionados: [],
      fildFilter: "title",
      title: "",
      loadingExercicios: false,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      showModalInfo: false,
      question: ""
    };
  }

  async componentDidMount() {
    document.title = "Criar lista - professor";
    await this.getQuestionsByList();
    this.getExercicios();
  }

  async getQuestionsByList(){
        const {id} = this.props.match.params;
        let query = `idList=${id}`;
        this.setState({loadingExercicios:true})
        try{
            const response = await api.get(`/question?${query}`);
            console.log("questoes selecionadas: ",response.data.list.title);
            this.setState({
                title: response.data.list.title,
                selecionados: response.data.questions,
            })

        }catch(err){
            console.log(err)
        }
  }
  async getExercicios() {
    let { contentInputSeach, numPageAtual, fildFilter } = this.state;
    let query = `?include=${contentInputSeach.trim()}`;
    query += `&field=${fildFilter}`;

    try {
      
      const response = await api.get(`/question/page/${numPageAtual}${query}`);
      console.log("exercicios:");
      console.log(response.data);
      this.setState({
        exercicios: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingExercicios: false
      });
    } catch (err) {
      this.setState({ loadingExercicios: false });
      console.log(err);
    }
  }

  async editarLista(e) {
    
    e.preventDefault();
    const {id} = this.props.match.params;
    const {title,selecionados} = this.state
    let msg=""
    msg += !title?"Informe o título da turma<br/>":"" ;
    msg += selecionados.length === 0? "Escolha pelo menos um exercício<br/>":"";
    if(msg){
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar lista",
        html:  msg
      });
      return null
    }
    const requestInfo = {
      title,
      questions: selecionados.map(q => q.id)
    };
    try {
      Swal.fire({
        title: "Editando lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.put(`/listQuestion/${id}/update`, requestInfo);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista editada com sucesso!"
      });
      this.props.history.push("/professor/listas")
    }catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar lista"
      });
        this.setState({ msg: "Erro: Não foi possivel salvar a lista" });
    }
  }
  selecionar(questao) {
    this.setState({
      selecionados: [...this.state.selecionados, questao]
    });
    //console.log(this.state.selecionados)
  }

  excluir(questao) {
    this.setState({
      selecionados: [...this.state.selecionados].filter(
        q => q.id !== questao.id
      )
      //exercicios: [...this.state.exercicios,questao]
    });
  }
  handleShowModalInfo(question) {
    console.log(question);
    this.setState({
      question: question,
      showModalInfo: true
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage
      },
      () => this.getExercicios()
    );
  }
  handleSelectfildFilter(e) {
    console.log(e.target.value);
    this.setState(
      {
        fildFilter: e.target.value
      } /*,()=>this.getExercicios()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value
      } /*,()=>this.getExercicios()*/
    );
  }
  filterSeash() {
    this.getExercicios();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
      },
      () => this.getExercicios()
    );
  }

  render() {
    const {
      loadingExercicios,
      contentInputSeach,
      numPageAtual,
      totalPages,
      selecionados,
      question,
      showModalInfo
    } = this.state;

    return (
      <TemplateSistema active="listas">
          <Row mb={15}>
            <Col xs={12}>
              <h5 style={{margin:'0px'}}>
                <Link to="/professor/listas">
                  Listas
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/> 
                Editar lista
              </h5>
            </Col>
          </Row>
          <Card>
          <CardBody>
            <form onSubmit={e => this.editarLista(e)}>
              <div className="form-row">
                <div className="form-group col-12">
                  <label htmlFor="inputTitulo">Título</label>
                  <input
                    id="inputTitulo"
                    type="text"
                    required
                    value={this.state.title}
                    onChange={e => this.handleTitleChange(e)}
                    className="form-control"
                    placeholder="Título da lista"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <InputGroupo
                    placeholder={`Perquise pelo nome ou código...`}
                    value={contentInputSeach}
                    handleContentInputSeach={this.handleContentInputSeach.bind(
                      this
                    )}
                    filterSeash={this.filterSeash.bind(this)}
                    handleSelect={this.handleSelectfildFilter.bind(this)}
                    options={[
                      { value: "title", content: "Nome" },
                      { value: "code", content: "Código" }
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
                      {loadingExercicios ? (
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
                        this.state.exercicios.map((questao, index) => {
                          return (
                            <tr key={questao.id}>
                              <td>{questao.title}</td>
                              <td>{questao.code}</td>
                              <td>{`(${questao.submissionsCorrectsCount}/${questao.submissionsCount})`}</td>
                              <td>{questao.author.email}</td>
                              <td>{formatDate(questao.createdAt)}</td>
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
                                  .map(s => s.id)
                                  .includes(questao.id) ? (
                                  <button
                                    type="button"
                                    className="float-right btn btn-indigo disabled"
                                  >
                                    Selecionada
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="float-right btn btn-primary"
                                    onClick={e => this.selecionar(questao)}
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
                  <NavPagination
                    totalPages={totalPages}
                    pageAtual={numPageAtual}
                    handlePage={this.handlePage.bind(this)}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <div className="col-12 text-center">
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
                          <td>{formatDate(questao.createdAt)}</td>
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
                </div>
              </Row>
              <Row>
                <Col xs={12} textCenter>
                  <button
                    type="submit"
                    className={`btn btn-primary float-right col-3 ${loadingExercicios?"btn-loading":""}`}

                    style={{ width: "100%" }}
                  >
                    Salvar Lista
                  </button>
                </Col>
              </Row>
            </form>
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
                        {question.description}
                    </Row>
                    <Row>
                        <Col xs={12} textCenter>
                          <BlockMath>{question.katexDescription|| ''}</BlockMath>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                          <TableIO
                            results={question.results || []}
                          />
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