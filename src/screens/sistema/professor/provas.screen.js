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

export default class HomeProvasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: "",
      provas: [],
      questions: [],
      showModal: false,
      loadingProvas: false,
      fieldFilter: "title",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      showModalInfo: false,
    };
    this.handlePage = this.handlePage.bind(this);
  }

  componentDidMount() {
    document.title = "Provas - professor";
    this.getProvas();
  }

  async getProvas() {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;

    try {
      this.setState({ loadingProvas: true });
      const response = await api.get(`/test/page/${numPageAtual}?${query}`);
      this.setState({
        provas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingProvas: false,
      });
    } catch (err) {
      this.setState({ loadingProvas: false });
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
      () => this.getProvas()
    );
  }
  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getProvas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getProvas()*/
    );
  }
  filterSeash() {
    this.getProvas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getProvas()
    );
  }

  render() {
    const {
      provas,
      fieldFilter,
      loadingProvas,
      contentInputSeach,
      numPageAtual,
      totalPages,
      showModalInfo,
      questions,
    } = this.state;
    return (
      <TemplateSistema active="provas">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>Provas</h5>
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={3}>
            <Link to="/professor/criarProva">
              <button className="btn btn-primary" type="button" style={botao}>
                Criar Prova <i className="fe fe-file-plus" />
              </button>
            </Link>
          </Col>
          <Col xs={9}>
            <InputGroup
              placeholder={`Perquise pelo ${
                fieldFilter === "title"
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
              loading={loadingProvas}
            />
          </Col>
        </Row>
        <Row mb={15}>
          <div className="col-12">
            <table style={lista} className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Senha</th>
                  <th>Criado em</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {loadingProvas ? (
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
                  </tr>
                ) : (
                  provas.map((prova) => {
                    return (
                      <Fragment key={prova.id}>
                        <tr>
                          <td>{prova.title}</td>
                          <td>{prova.code}</td>
                          <td>{prova.password}</td>
                          <td>{moment(prova.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary float-right"
                              onClick={() =>
                                this.handleShowModalInfo(prova.questions)
                              }
                            >
                              <i className="fa fa-info" />
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Row>
        <Row>
          <Col xs={12} textCenter>
            <Pagination 
              count={totalPages} 
              page={Number(numPageAtual)} 
              onChange={this.handlePage} 
              color="primary" 
              size="large"
              disabled={loadingProvas}
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
            <div className="row">
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
                                    toolbarContainer : '#toolbar_container',
                                    resizingBar : false,
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
            </div>
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
