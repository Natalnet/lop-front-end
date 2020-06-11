import React, { Component, Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import TurmaProvasScreen from "components/screens/turmaProvas.componente.screen";

export default class Provas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provas: [],
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      loandingTodasProvas: true,
      loandingProvas: false,
      showModalProvas: false,
      showModalInfo: false,
      todasprovas: [],
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      contentInputSeach: "",
      fieldFilter: "title",
      questions: [],
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getProvas();
    const { turma } = this.state;
    document.title = `${turma && turma.name} - provas`;
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

  async inserirProva(test) {
    const { id } = this.props.match.params;
    const request = {
      idClass: id,
      idTest: test.id,
    };
    try {
      Swal.fire({
        title: "Adicionando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      await api.post(`/classHasTest/store`, request);
      this.handleCloseshowModalProvas();
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova Adicionada com Sucesso!",
      });
      this.getProvas();
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Prova não pôde ser adicionado",
      });
    }
  }
  async removerProva(prova) {
    const idTest = prova.id;
    const idClass = this.props.match.params.id;
    const query = `?idClass=${idClass}`;
    try {
      const { value } = await Swal.fire({
        title: `Tem certeza que quer remover "${prova.title}" da turma?`,
        //text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover prova!",
        cancelButtonText: "Não, cancelar!",
      });
      if (!value) return null;
      Swal.fire({
        title: "Removendo prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.delete(`/classHasTest/${idTest}/delete${query}`);
      const { provas } = this.state;
      this.setState({ provas: provas.filter((prova) => prova.id !== idTest) });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova removido com sucesso!",
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Prova não pôde ser removido",
      });
    }
  }
  async getProvas() {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`;
    //query += `$idNotIn=${}`
    try {
      this.setState({ loandingProvas: true });
      const response = await api.get(`/test${query}`);
      this.setState({
        provas: [...response.data],
        loandingProvas: false,
      });
    } catch (err) {
      this.setState({ loandingProvas: false });
      console.log(err);
    }
  }

  async getTodasProvas() {
    const { numPageAtual, contentInputSeach, fieldFilter, provas } = this.state;
    let query = `?idNotIn=${provas.map((p) => p.id).join(" ")}`;
    query += `&include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;
    try {
      this.setState({ loandingTodasProvas: true });
      const response = await api.get(`/test/page/${numPageAtual}${query}`);
      this.setState({
        todasprovas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        loandingTodasProvas: false,
      });
    } catch (err) {
      this.setState({ loandingTodasProvas: false });
      console.log(err);
    }
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getTodasProvas()
    );
  }
  handleShowModalInfo(questions) {
    this.setState({
      showModalInfo: true,
      questions: [...questions],
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }
  handleshowModalProvas(e) {
    this.getTodasProvas();
    this.setState({ showModalProvas: true });
  }
  handleCloseshowModalProvas(e) {
    this.setState({ showModalProvas: false });
  }

  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getTodasProvas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getTodasProvas()*/
    );
  }
  filterSeash() {
    this.getTodasProvas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getTodasProvas()
    );
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      todasprovas,
      loandingTodasProvas,
      totalPages,
      numPageAtual,
      provas,
    } = this.state;
    const {
      contentInputSeach,
      fieldFilter,
      showModalProvas,
      questions,
      showModalInfo,
      loandingProvas,
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
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" /> Provas
              </h5>
            )}
          </Col>
        </Row>

        <Row mb={15}>
          <Col xs={3}>
            <button
              className={`btn btn-primary ${loandingProvas && "btn-loading"}`}
              onClick={() => this.handleshowModalProvas()}
            >
              Adicionar novas provas <i className="fa fa-plus-circle" />
            </button>
          </Col>
        </Row>
        {loandingProvas ? (
          <Row mb={15}>
            <div className="loader" style={{ margin: "0px auto" }}></div>
          </Row>
        ) : (
          <TurmaProvasScreen
            {...this.state}
            {...this.props}
            provas={provas}
            removerProva={this.removerProva.bind(this)}
          />
        )}
        <Modal
          show={showModalProvas}
          onHide={this.handleCloseshowModalProvas.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Provas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <>
              <Row mb={15}>
                <Col xs={12}>
                  <InputGroup
                    placeholder={`Perquise pelo ${
                      fieldFilter === "title"
                        ? "Nome"
                        : fieldFilter === "code"
                        ? "Código"
                        : "..."
                    }`}
                    value={contentInputSeach}
                    handleContentInputSeach={this.handleContentInputSeach.bind(
                      this
                    )}
                    filterSeash={this.filterSeash.bind(this)}
                    handleSelect={this.handleSelectFieldFilter.bind(this)}
                    options={[
                      { value: "title", content: "Nome" },
                      { value: "code", content: "Código" },
                    ]}
                    clearContentInputSeach={this.clearContentInputSeach.bind(
                      this
                    )}
                    loading={loandingTodasProvas}
                  />
                </Col>
              </Row>
              <Row>
                {loandingTodasProvas ? (
                  <div className="loader" style={{ margin: "0px auto" }} />
                ) : (
                  todasprovas.map((prova, index) => (
                    <Fragment key={prova.id}>
                      <Col xs={12}>
                        <Card>
                          <CardHead>
                            <CardTitle>
                              {`${prova.title} - ${prova.code}`}
                            </CardTitle>
                            <CardOptions>
                              <div
                                className="btn-group  float-right"
                                role="group"
                                aria-label="Exemplo básico"
                              >
                                <button
                                  className="btn-primary btn"
                                  onClick={() => this.inserirProva(prova)}
                                >
                                  Adicionar
                                </button>
                                <button
                                  className="btn btn-primary"
                                  data-toggle="collapse"
                                  data-target={"#collapse" + prova.id}
                                  style={{ position: "relative" }}
                                >
                                  <i className="fe fe-chevron-down" />
                                </button>
                              </div>
                            </CardOptions>
                          </CardHead>
                          <div className="collapse" id={"collapse" + prova.id}>
                            <CardBody>
                              <Row>
                                <b>Exercícios: </b>
                              </Row>
                              <Row>
                                {prova.questions.map((questao) => (
                                  <Fragment key={questao.id}>
                                    <Col xs={12}>
                                      <p>{index + 1 + " - " + questao.title}</p>
                                    </Col>
                                  </Fragment>
                                ))}
                              </Row>
                            </CardBody>
                          </div>
                        </Card>
                      </Col>
                    </Fragment>
                  ))
                )}
              </Row>
              <Row mb={15}>
                <Col xs={12} textCenter>
                  <NavPagination
                    totalPages={totalPages}
                    pageAtual={numPageAtual}
                    handlePage={this.handlePage.bind(this)}
                  />
                </Col>
              </Row>
            </>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={this.handleCloseshowModalProvas.bind(this)}
            >
              Fechar
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalInfo}
          onHide={this.handleCloseshowModalInfo.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Questões
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {questions.map((questao, index) => (
                <div key={index} className="col-6">
                  <Card>
                    <CardHead>
                      <CardTitle>{questao.title}</CardTitle>
                      <CardOptions>
                        <button
                          className="btn btn-primary"
                          data-toggle="collapse"
                          data-target={"#collapse" + questao.id}
                          style={{ position: "relative" }}
                        >
                          <i className="fe fe-chevron-down" />
                        </button>
                      </CardOptions>
                    </CardHead>
                    <div className="collapse" id={"collapse" + questao.id}>
                      <CardBody>
                        <b>Descrição: </b>
                        <p>{questao.description}</p>
                        <br />
                        <BlockMath>{questao.katexDescription || ""}</BlockMath>
                        <br />
                      </CardBody>
                    </div>
                  </Card>
                </div>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={this.handleCloseshowModalInfo.bind(this)}
            >
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
      </TemplateSistema>
    );
  }
}
