import React, { Component, Fragment } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import "katex/dist/katex.min.css";
import moment from "moment";
import SwalModal from "../../../components/ui/modal/swalModal.component";
import { CSVLink } from "react-csv";

import { Pagination } from "../../../components/ui/navs";

import InputGroup from "../../../components/ui/inputGroup/inputGroupo.component";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardOptions from "../../../components/ui/card/cardOptions.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import TurmaListasScrren from "../.././../components/screens/turmaListas.componente.screen";

export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listas: [],
      list: "",
      loadingInfoTurma: true,
      loadingDateLimit: false,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      loandingTodasListas: true,
      loandingListas: false,
      showModalListas: false,
      showModalDate: false,
      todasListas: [],
      dateLimit: "",
      timeLimit: "23:59",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      contentInputSeach: "",
      fieldFilter: "title",
      questions: [],
      showModalCSV: false,
      csvData: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getListas();
    const { turma } = this.state;
    document.title = `${turma && turma.name} - listas`;
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

  async inserirLista(lista) {
    const { id } = this.props.match.params;
    const idLista = lista.id;
    const request = {
      idClass: id,
      idList: idLista,
    };
    try {
      Swal.fire({
        title: "Adicionando lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      await api.post(`/classHasListQuestion/store`, request);
      this.handleCloseshowModalListas();
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista adicionada com sucesso!",
      });

      this.getListas();
      this.handleShowModalDate(lista);
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Lista não pôde ser adicionada",
      });
    }
  }
  async removerLista(list) {
    const idClass = this.props.match.params.id;
    const idList = list.id;
    const query = `?idClass=${idClass}`;
    try {
      const { value } = await Swal.fire({
        title: `Tem certeza que quer remover "${list.title}" da turma?`,
        //text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover lista!",
        cancelButtonText: "Não, cancelar!",
      });
      if (!value) return null;
      Swal.fire({
        title: "Removendo lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.delete(`/classHasListQuestion/${idList}/delete${query}`);
      const { listas } = this.state;
      this.setState({ listas: listas.filter((lista) => lista.id !== idList) });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista removida com sucesso!",
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Lista não pôde ser removida",
      });
    }
  }
  async getTodasListas() {
    const { numPageAtual, contentInputSeach, fieldFilter, listas } = this.state;
    let query = `?idNotInt=${listas.map((l) => l.id).join(" ")}`;
    query += `&include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;

    try {
      this.setState({ loandingTodasListas: true });
      const response = await api.get(
        `/listQuestion/page/${numPageAtual}${query}`
      );
      this.setState({
        todasListas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        loandingTodasListas: false,
      });
    } catch (err) {
      this.setState({ loandingTodasListas: false });
      console.log(err);
    }
  }
  async getListas() {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`;
    try {
      this.setState({ loandingListas: true });
      const response = await api.get(`/listQuestion${query}`);
      this.setState({
        listas: [...response.data],
        loandingListas: false,
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }
  async addDateLimit(list) {
    const idClass = this.props.match.params.id;
    const idList = list.id;
    const query = `?idClass=${idClass}`;
    const { dateLimit, timeLimit } = this.state;

    if (dateLimit) {
      const request = {
        submissionDeadline: moment(`${dateLimit} ${timeLimit}:59`).utc(),
      };
      try {
        this.setState({ loadingDateLimit: true });
        await api.put(
          `/classHasListQuestion/${idList}/update${query}`,
          request
        );
        this.getListas();
        this.handleCloseShowModalDate();
        this.setState({ loadingDateLimit: false });
        Swal.fire({
          type: "success",
          title: "Data limite para submissões adicionada com sucesso!",
        });
      } catch (err) {
        console.log(err);
        this.setState({ loadingDateLimit: false });
        Swal.fire({
          type: "error",
          title: "ops... data limite não pôde ser adicionada",
        });
      }
    }
  }

  async generateCsv() {
    const { id } = this.props.match.params;
    Swal.showLoading();
    try {
      const response = await api.get(`/dataScience/class/${id}/list`);
      this.setState({ showModalCSV: true })
      //console.log('csv: ',response.data);
      // console.log('formated csv',this.formatCsv(response.data));
      this.setState({
        csvData: this.formatCsv(response.data),
      })
    }
    catch (err) {
      console.log(err);
    }
    Swal.hideLoading();
  }

  formatCsv(rows) {
    let tableHeader = rows[0].lists.map(row => {
      const dateBegin = row.classHasListQuestion.createdAt;
      const dateEnd = row.classHasListQuestion.submissionDeadline;
      return `${row.title} (${dateBegin ? moment(dateBegin).format("DD/MM/YYYY") : ''}${dateEnd ? ` - ${moment(dateEnd).format("DD/MM/YYYY")}` : ''})`;
    })
    tableHeader = [
      'Nome',
      'Matrícula',
      ...tableHeader
    ]
    //console.log('tableHeader: ', tableHeader)
    const tableBody = rows.map(row => {
      let colsLists = row.lists.map(colList =>
        Math.round((colList.questionsCompletedSumissionsCount / colList.questionsCount) * 100)
      )
      return [
        row.name,
        row.enrollment,
        ...colsLists
      ];
    })
    const table = [tableHeader, ...tableBody];
    return table;
  }
  changeDate(e) {
    this.setState({ dateLimit: e.target.value });
  }

  changeTime(e) {
    this.setState({ timeLimit: e.target.value });
  }

  handleShowModalDate(list) {
    this.setState({
      list: list,
      showModalDate: true,
    });
  }
  handleCloseShowModalDate(e) {
    this.setState({ showModalDate: false });
  }
  handleShowModalListas(e) {
    this.getTodasListas();
    this.setState({ showModalListas: true });
  }
  handleCloseshowModalListas(e) {
    this.setState({ showModalListas: false });
  }

  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getTodasListas()
    );
  }

  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getTodasListas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getTodasListas()*/
    );
  }
  filterSeash() {
    this.getTodasListas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getTodasListas()
    );
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      list,
      showModalDate,
      loadingDateLimit,
      todasListas,
      loandingTodasListas,
      totalPages,
      numPageAtual,
      listas,
      timeLimit,
      showModalCSV,
      csvData
    } = this.state;
    const {
      contentInputSeach,
      fieldFilter,
      showModalListas,
      loandingListas,
    } = this.state;
    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
                <h5 style={{ margin: "0px" }}>
                  <i className="fa fa-users mr-2" aria-hidden="true" />
                  {turma && turma.name} - {turma && turma.year}.
                  {turma && turma.semester}
                  <i className="fa fa-angle-left ml-2 mr-2" /> Listas
                </h5>
              )}
          </Col>
        </Row>

        <Row mb={15}>
          <Col xs={12}>
            <button
              className={`btn btn-primary mr-5 ${loandingListas && "btn-loading"}`}
              onClick={() => this.handleShowModalListas()}
            >
              Adicionar novas listas <i className="fa fa-plus-circle" />
            </button>
            <button
              className={'btn btn-primary'}
              onClick={() => this.generateCsv()}
            >
              Gerar CSV 
              </button>
          </Col>
        </Row>
        {loandingListas ? (
          <Row mb={15}>
            <div className="loader" style={{ margin: "0px auto" }}></div>
          </Row>
        ) : (
            <TurmaListasScrren
              {...this.state}
              {...this.props}
              listas={listas}
              removerLista={this.removerLista.bind(this)}
            />
          )}
        <Modal
          show={showModalListas}
          onHide={this.handleCloseshowModalListas.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Listas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Fragment>
              <Row mb={15}>
                <Col xs={12}>
                  <InputGroup
                    placeholder={`Perquise pelo ${fieldFilter === "title"
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
                    loading={loandingTodasListas}
                  />
                </Col>
              </Row>
              <Row>
                {loandingTodasListas ? (
                  <div className="loader" style={{ margin: "0px auto" }} />
                ) : (
                    todasListas.map((lista, index) => (
                      <Fragment key={lista.id}>
                        <Col xs={12}>
                          <Card>
                            <CardHead>
                              <CardTitle>
                                {`${lista.title} - ${lista.code}`}
                              </CardTitle>
                              <CardOptions>
                                <div
                                  className="btn-group  float-right"
                                  role="group"
                                  aria-label="Exemplo básico"
                                >
                                  <button
                                    className="btn-primary btn"
                                    onClick={() => this.inserirLista(lista)}
                                  >
                                    Adicionar
                                </button>
                                  <button
                                    className="btn btn-primary"
                                    data-toggle="collapse"
                                    data-target={"#collapse" + lista.id}
                                    style={{ position: "relative" }}
                                  >
                                    <i className="fe fe-chevron-down" />
                                  </button>
                                </div>
                              </CardOptions>
                            </CardHead>
                            <div className="collapse" id={"collapse" + lista.id}>
                              <CardBody>
                                <Row>
                                  <b>Questões: </b>
                                </Row>
                                <Row>
                                  {lista.questions.map((questao, index) => (
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
              <Row>
                <Col xs={12} textCenter>
                  <Pagination
                    count={totalPages}
                    page={Number(numPageAtual)}
                    onChange={this.handlePage.bind(this)}
                    color="primary"
                    size="large"
                    disabled={loandingTodasListas}
                  />
                </Col>
              </Row>
            </Fragment>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={this.handleCloseshowModalListas.bind(this)}
            >
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showModalDate}
          onHide={this.handleCloseShowModalDate.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title">
              {`Adicionar data limite para as submissões na lista '${list.title}'`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={12} textCenter>
                <input type="date" onChange={(e) => this.changeDate(e)} /> -{" "}
                <input
                  type="time"
                  value={timeLimit}
                  onChange={(e) => this.changeTime(e)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              className={`btn btn-primary ${loadingDateLimit && "btn-loading"}`}
              onClick={() => this.addDateLimit(list)}
            >
              Adicionar
            </button>
            <button
              className={`btn btn-danger  ${loadingDateLimit && "btn-loading"}`}
              onClick={this.handleCloseShowModalDate.bind(this)}
            >
              Não adicionar data limite
            </button>
          </Modal.Footer>
        </Modal>
        <SwalModal
          show={showModalCSV}
          handleModal={() =>  this.setState({showModalCSV:false})}
        >
          <Row>
            <Col xs={12} textCenter>
              {csvData && <CSVLink
                data={csvData}
                filename={`${turma && turma.name}-${moment().local().format("YYYY-MM-DD-HH-mm")}.csv`}
                className={'btn btn-primary btn-lg'}
                onClick={()=>this.setState({showModalCSV: false})}
              >
                Baixar CSV <i className=" fa fa-download ml-5" />
              </CSVLink>}
            </Col>
          </Row>
        </SwalModal>
      </TemplateSistema>
    );
  }
}
