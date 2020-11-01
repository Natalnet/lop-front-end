import React, { Component, Fragment } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";

import { Pagination } from "components/ui/navs";

import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import { Modal } from "react-bootstrap";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import moment from "moment";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

const lista = {
  backgroundColor: "white",
};

const botao = {
  width: "100%",
};

export default class HomeListasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: "",
      listas: [],
      questions: [],
      showModal: false,
      loadingListas: false,
      fieldFilter: "title",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      showModalInfo: false,
    };
    this.handlePage = this.handlePage.bind(this);
  }

  componentDidMount() {
    document.title = "Listas - professor";
    this.getListas();
  }

  async getListas() {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;

    try {
      this.setState({ loadingListas: true });
      const response = await api.get(
        `/listQuestion/page/${numPageAtual}?${query}`
      );
      this.setState({
        listas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingListas: false,
      });
    } catch (err) {
      this.setState({ loadingListas: false });
      console.log(err);
    }
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
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getListas()
    );
  }
  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getListas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getListas()*/
    );
  }
  filterSeash() {
    this.getListas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getListas()
    );
  }

  render() {
    const {
      listas,
      fieldFilter,
      loadingListas,
      contentInputSeach,
      numPageAtual,
      totalPages,
      showModalInfo,
      questions,
    } = this.state;
    return (
      <TemplateSistema active="listas">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>Listas</h5>
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={3}>
            <Link to="/professor/criarlista">
              <button className="btn btn-primary" type="button" style={botao}>
                Criar Lista
                <i className="fe fe-file-plus" />
              </button>
            </Link>
          </Col>
          <Col xs={9}>
            <InputGroup
              placeholder={`Perquise pelo ${fieldFilter === "title"
                ? "Nome"
                : fieldFilter === "code"
                  ? "Código"
                  : "..."
                }`}
              value={contentInputSeach}
              handleContentInputSeach={this.handleContentInputSeach.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[
                { value: "title", content: "Nome" },
                { value: "code", content: "Código" },
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loadingListas}
            />
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <table style={lista} className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Autor(a)</th>
                  <th>Criado em</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {loadingListas ? (
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
                    listas.map((lista, index) => {
                      return (
                        <Fragment key={index}>
                          <tr>
                            <td>{lista.title}</td>
                            <td>{lista.code}</td>
                            <td>{lista.author && lista.author.email}</td>
                            <td>{moment(lista.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                            <td className="d-inline-flex ">
                              <button
                                title="Ver informações da lista"
                                className="btn btn-primary float-right mr-2"
                                onClick={() =>
                                  this.handleShowModalInfo(lista.questions)
                                }
                              >
                                <i className="fa fa-info" />
                              </button>

                              {
                                <Link to={`/professor/listas/${lista.id}/editar`}>
                                  <button
                                    title="Editar Lista"
                                    className={`btn btn-info mr-2 ${lista.author &&
                                      sessionStorage.getItem("user.email") ===
                                      lista.author.email
                                      ? "inline-block"
                                      : "d-none"
                                      }`}
                                  >
                                    <i className="fe fe-edit" />
                                  </button>
                                </Link>
                              }
                              <Link to={`/professor/criarlista?idList=${lista.id}`} >
                                <button className="btn btn-warning " title="Clonar Lista">
                                  <i className="fa fa-copy" />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })
                  )}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col xs={12} textCenter>
            <Pagination
              count={totalPages}
              page={Number(numPageAtual)}
              onChange={this.handlePage}
              color="primary"
              size="large"
              disabled={loadingListas}
            />
          </Col>
        </Row>
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
                <Fragment key={index}>
                  <Col xs={12}>
                    <Card style={{ marginBottom: "0" }}>
                      <CardHead style={{ marginBottom: "0" }}>
                        <CardTitle>{questao.title}</CardTitle>
                        <CardOptions>
                          <button
                            className="btn btn-primary"
                            data-toggle="collapse"
                            data-target={"#collapse" + questao.id}
                            style={{ position: "relative" }}
                          >
                            <i className={`fe fe-chevron-down`} />
                          </button>
                        </CardOptions>
                      </CardHead>
                      <div className="collapse" id={"collapse" + questao.id}>
                        <CardBody>
                          <Row>
                            <b>Descrição: </b>
                          </Row>
                          <Row>
                            {/* <p>{questao.description}</p> */}
                            <SunEditor
                              lang="pt_br"
                              height="auto"
                              disable={true}
                              showToolbar={false}
                              // onChange={this.handleDescriptionChange.bind(this)}
                              setContents={questao.description}
                              setDefaultStyle="font-size: 15px; text-align: justify"
                              setOptions={{
                                toolbarContainer: '#toolbar_container',
                                resizingBar: false,
                                katex: katex,
                              }}
                            />

                          </Row>
                          <Row>
                            <Col xs={12} textCenter>
                              <BlockMath>
                                {questao.katexDescription || ""}
                              </BlockMath>
                            </Col>
                          </Row>
                        </CardBody>
                      </div>
                    </Card>
                  </Col>
                </Fragment>
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
