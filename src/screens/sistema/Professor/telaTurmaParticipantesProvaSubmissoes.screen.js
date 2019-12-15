import React, { Component } from "react";
import socket from "socket.io-client";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import api, { baseUrlBackend } from "../../../services/api";
import formataData from "../../../util/funçoesAuxiliares/formataData";
import SwalModal from "components/ui/modal/swalModal.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import "katex/dist/katex.min.css";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/javascript";
import "brace/theme/monokai";

const lista = {
  backgroundColor: "white"
};

export default class HomesubmissoesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingInfoTurma: true,
      submissoes: [],
      usuario : null,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      showModal: false,
      loadingSubmissoes: false,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      docsPerPage: 15,
      submissao: ""
    };
    this.handlePage = this.handlePage.bind(this);
  }
  async componentDidMount() {
    this.getSubmissoes();
    await this.getInfoTurma();
    const {turma} = this.state
    document.title = `${turma && turma.name} - Submissões`;
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { turma } = this.state;
    if (!turma || (turma && turma.id !== id)) {
      console.log("dentro do if");
      try {
        const response = await api.get(`/class/${id}`);
        const turmaData = {
          id: response.data.id,
          name: response.data.name,
          year: response.data.year,
          semester: response.data.semester,
          languages: response.data.languages
        };
        this.setState({
          turma: turmaData,
          loadingInfoTurma: false
        });
        sessionStorage.setItem("turma", JSON.stringify(turmaData));
      } catch (err) {
        this.setState({ loadingInfoTurma: false });
        console.log(err);
      }
    } else {
      this.setState({ loadingInfoTurma: false });
    }
  }
  async getSubmissoes(loading = true) {
    const {id,idProva,idExercicio,idUser} = this.props.match.params;
    console.log('ir prova');
    console.log(idProva);
    const {
      numPageAtual,
      docsPerPage
    } = this.state;
    let query = `?docsPerPage=${docsPerPage}`;
    try {
      if (loading) this.setState({ loadingSubmissoes: true });
      const response = await api.get(
        `/submissions/class/${id}/user/${idUser}/test/${idProva}/question/${idExercicio}/page/${numPageAtual}${query}`
      );
      console.log("todas submissoes:");
      console.log(response.data);
      this.setState({
        submissoes: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingSubmissoes: false,
        usuario : response.data.user
      });
    } catch (err) {
      this.setState({ loadingSubmissoes: false });
      console.log(err);
    }
  }
  handleShowModalInfo(submissao) {
    //console.log(question);
    this.setState({
      submissao: submissao,
      showModalInfo: true
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
        numPageAtual: numPage
      },
      () => this.getSubmissoes()
    );
  }

 
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
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
      usuario,
    } = this.state;
    return (
      <TemplateSistema
        active="participantes"
        {...this.props}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
            {loadingInfoTurma || loadingSubmissoes?(
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
                <Col xs={12}>
                    <h3 style={{ margin: "0px" }}>
                      <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                      {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} | {usuario && usuario.name} - {usuario && usuario.enrollment}
                    </h3>
                </Col>
            )}
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <Link
              to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/provas/${this.props.match.params.idProva}/exercicios`}
            >
              <button className="btn btn-success mr-2">
                <i className="fa fa-arrow-left" /> Voltar para prova{" "}
                <i className="fa fa-file-text" />
              </button>
            </Link>
          </Col>
        </Row>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            <table style={lista} className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Percentual de acerto</th>
                  <th>Tempo gasto</th>
                  <th>ip</th>
                  <th>N° de variações de caractéres</th>
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
                  </tr>
                ) : (
                  submissoes.map((submission, index) => (
                    <tr key={submission.id}>
                      <td className="text-center">
                        <div
                          className="avatar d-block"
                          style={{
                            backgroundImage: `url(${submission.user.urlImage ||
                              "https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg"})`
                          }}
                        />
                      </td>
                      <td
                        style={{
                          color: `${
                            parseFloat(submission.hitPercentage) === 100
                              ? "#0f0"
                              : "#f00"
                          }`
                        }}
                      >
                        <b>{parseFloat(submission.hitPercentage)}%</b>
                      </td>
                      <td>
                        {parseInt(submission.timeConsuming / 1000 / 60)}min
                        {parseInt((submission.timeConsuming / 1000) % 60)}seg
                      </td>
                      <td>{submission.ip}</td>
                      <td>{submission.char_change_number}</td>
                      <td>{submission.environment}</td>
                      <td>{formataData(submission.createdAt)}</td>
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
          </div>
        </div>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12 text-center">
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageAtual}
              handlePage={this.handlePage}
            />
          </div>
        </div>

        <SwalModal
          show={showModalInfo}
          title={submissao && submissao.question.description}
          handleModal={this.handleCloseshowModalInfo.bind(this)}
          width={"100%"}
        >
          <div className="row">
            <div className="col-12 offset-md-2 col-md-8 text-center">
              <AceEditor
                mode={
                  submissao.language === "cpp" ? "c_cpp" : submissao.language
                }
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
          </div>
        </SwalModal>
      </TemplateSistema>
    );
  }
}
