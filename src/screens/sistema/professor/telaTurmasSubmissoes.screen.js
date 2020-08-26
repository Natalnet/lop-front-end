import React, { Component } from "react";
import socket from "socket.io-client";
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";

import { Pagination } from "components/ui/navs";

import api, { baseUrlBackend } from "../../../services/api";
import moment from "moment";
import SwalModal from "components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import AceEditorWrapper from "components/templates/aceEditorWrapper.template";

import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

const lista = {
  backgroundColor: "white",
};

export default class HomesubmissoesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingInfoTurma: true,
      contentInputSeach: "",
      submissoes: [],
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      showModal: false,
      loadingSubmissoes: false,
      fieldFilter: "name",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      docsPerPage: 15,
      submissao: "",
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getSubmissoes();
    this.getSubmissoesRealTime();

    const { turma } = this.state;
    document.title = `${turma && turma.name} - Submissões`;
  }
  componentWillUnmount() {
    this.io && this.io.close();
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
  async getSubmissoes(loading = true) {
    const id = this.props.match.params.id;
    const {
      numPageAtual,
      contentInputSeach,
      fieldFilter,
      docsPerPage,
    } = this.state;
    let query = `?idClass=${id}`;
    query += `&include=${contentInputSeach.trim()}`;
    query += `&profile=ALUNO`;
    query += `&field=${fieldFilter}`;
    query += `&docsPerPage=${docsPerPage}`;
    try {
      if (loading) this.setState({ loadingSubmissoes: true });
      const response = await api.get(
        `/submissions/page/${numPageAtual}${query}`
      );
      this.setState({
        submissoes: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingSubmissoes: false,
      });
    } catch (err) {
      this.setState({ loadingSubmissoes: false });
      console.log(err);
    }
  }
  getSubmissoesRealTime() {
    this.io = socket(baseUrlBackend);
    const id = this.props.match.params.id;
    this.io.emit("connectRoonClass", id); //conectando à sala
    this.io.on("SubmissionClass", (response) => {
      const { numPageAtual, submissoes, docsPerPage } = this.state;
      if (numPageAtual === 1) {
        let sub = [...submissoes];
        if (submissoes.length === docsPerPage) {
          sub.pop();
        }
        sub = [response, ...sub];
        this.setState({ submissoes: sub });
      } else {
        this.getSubmissoes(false);
      }
    });
  }
  handleShowModalInfo(submissao) {
    //console.log(question);
    this.setState({
      submissao: submissao,
      showModalInfo: true,
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
      () => this.getSubmissoes()
    );
  }
  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getSubmissoes()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getSubmissoes()*/
    );
  }
  filterSeash(e) {
    //e.preventDefault()
    this.getSubmissoes();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getSubmissoes()
    );
  }
  render() {
    const {
      submissoes,
      showModalInfo,
      fieldFilter,
      loadingSubmissoes,
      contentInputSeach,
      numPageAtual,
      totalPages,
      submissao,
      loadingInfoTurma,
      turma,
    } = this.state;
    return (
      <TemplateSistema
        active="submissoes"
        {...this.props}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" /> Submissões
              </h5>
            )}
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12} mb={3}>
            <InputGroup
              placeholder={`Perquise pelo ${
                fieldFilter === "name"
                  ? "nome do aluno"
                  : fieldFilter === "title"
                  ? "nome da questão"
                  : "..."
              }`}
              value={contentInputSeach}
              handleContentInputSeach={this.handleContentInputSeach.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[
                { value: "name", content: "Aluno" },
                { value: "title", content: "Questão" },
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loadingSubmissoes}
            />
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <table style={lista} className="table table-hover table-responsive">
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Questão</th>
                  <th>Percentual de acerto</th>
                  <th>Tempo gasto</th>
                  <th>ip</th>
                  <th>Ambiente</th>
                  <th>Submetido em</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingSubmissoes ? (
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
                  submissoes.map((submission, index) => (
                    <tr key={submission.id}>
                      <td className="text-center">
                        <div
                          className="avatar d-block"
                          style={{
                            backgroundImage: `url(${
                              submission.user.urlImage ||
                              "https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg"
                            })`,
                          }}
                        />
                      </td>
                      <td>{submission.user.name}</td>
                      <td>{submission.question.title}</td>
                      <td
                        style={{
                          color: `${
                            parseFloat(submission.hitPercentage) === 100
                              ? "#5eba00"
                              : "#f00"
                          }`,
                        }}
                      >
                        <b>{parseFloat(submission.hitPercentage)}%</b>
                      </td>
                      <td>
                        {parseInt(submission.timeConsuming / 1000 / 60)}min
                        {parseInt((submission.timeConsuming / 1000) % 60)}seg
                      </td>
                      <td>{submission.ip}</td>
                      <td>{submission.environment}</td>
                      <td>{moment(submission.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                      <td>
                        <button
                          className="btn btn-primary mr-2"
                          onClick={() => this.handleShowModalInfo(submission)}
                        >
                          <i className="fa fa-info" />
                        </button>
                      </td>
                    </tr>
                  ))
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
              onChange={this.handlePage.bind(this)} 
              color="primary" 
              size="large"
              disabled={loadingSubmissoes}
            />
          </Col>
        </Row>

        <SwalModal
          show={showModalInfo}
          title={submissao && submissao.question.description}
          handleModal={this.handleCloseshowModalInfo.bind(this)}
          width={"100%"}
        >
          <Row>
            <div className="col-12 offset-md-2 col-md-8 text-center">
              <AceEditorWrapper
                mode={submissao.language}
                readOnly={true}
                width={"100%"}
                focus={false}
                theme="monokai"
                showPrintMargin={false}
                value={submissao.answer || ""}
                fontSize={16}
                name="ACE_EDITOR_RES"
                editorProps={{ $blockScrolling: true }}
              />
            </div>
          </Row>
        </SwalModal>
      </TemplateSistema>
    );
  }
}
