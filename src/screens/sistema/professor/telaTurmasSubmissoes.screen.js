import React, { Component } from "react";
import socket from "socket.io-client";
import TemplateSistema from "../../../components/templates/sistema.template";
import InputGroup from "../../../components/ui/inputGroup/inputGroupo.component";
import profileImg from "../../../assets/perfil.png";
import Swal from "sweetalert2";
import { Pagination } from "../../../components/ui/navs";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import api, { baseUrlBackend } from "../../../services/api";
import moment from "moment";
import SwalModal from "../../../components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import AceEditorWrapper from "../../../components/templates/aceEditorWrapper.template";
import { CSVLink } from "react-csv";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import * as B from "../../../components/ui/blockly";
import { isXml } from '../../../util/auxiliaryFunctions.util';
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
      showModalCSV: false,
      loadingSubmissoes: false,
      fieldFilter: "name",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      docsPerPage: 15,
      submissao: "",
      csvData: []
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getSubmissoes();
    //this.getSubmissoesRealTime();

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
    //console.log('obtendo submissçoes')
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

  async generateCsv() {
    const { id } = this.props.match.params;
    Swal.showLoading();
    try {
      const response = await api.get(`/dataScience/class/${id}/submission`);
      console.log('csv', response.data);
      // console.log('formated csv',this.formatCsv(response.data));
      this.setState({
        csvData: this.formatCsv(response.data),
        showModalCSV: true
      })
    }
    catch (err) {
      console.log(err);
    }
    Swal.hideLoading();
  }

  formatCsv(rows) {
    if (!rows.length) {
      return [];
    }
    let tableHeader = [
      "Nome",
      "Email",
      "Matrícula",
      "Tempo gasto",
      "N° de variações de caracteres",
      "ip",
      "Linguagem",
      "data",
      "idQuestão",
      "idLista",
      "idProva",
    ]
    //console.log('tableHeader: ', tableHeader)
    const tableBody = rows.map(row => {
      return [
        row.user.name,
        row.user.email,
        row.user.enrollment,
        row.timeConsuming,
        row.char_change_number,
        row.ip,
        row.language,
        moment(row.createdAt).local().format("DD/MM/YYYY HH:mm"),
        row.question_id,
        row.listQuestions_id,
        row.question_id,
      ]
    })
    //console.log('result: ',typeresult)
    const table = [tableHeader, ...tableBody];
    //console.log('table: ',table);
    return table;
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
      showModalCSV,
      csvData
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
        {/* <Row  mb={15}>
          <Col xs={12}>
              <button
                className={'btn btn-primary'}
                onClick={()=>this.generateCsv()}
              >
                Gerar CSV

              </button>
          </Col> 
        </Row> */}
        <Row mb={15}>
          <Col xs={12} mb={3}>
            <InputGroup
              placeholder={`Perquise pelo ${fieldFilter === "name"
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
                              backgroundImage: `url(${submission.user.urlImage || profileImg})`,
                            }}
                          />
                        </td>
                        <td>{submission.user.name}</td>
                        <td>{submission.question.title}</td>
                        <td
                          style={{
                            color: `${parseFloat(submission.hitPercentage) === 100
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
          handleModal={this.handleCloseshowModalInfo.bind(this)}
          width={"80%"}
        >
          <>
            <Row mb={15}>
              <Col xs={12}>
                <SunEditor
                  lang="pt_br"
                  height="auto"
                  disable={true}
                  showToolbar={false}
                  // onChange={this.handleDescriptionChange.bind(this)}
                  setContents={submissao && submissao.question.description}
                  setDefaultStyle="font-size: 15px; text-align: justify"
                  setOptions={{
                    toolbarContainer: '#toolbar_container',
                    resizingBar: false,
                    katex: katex,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <div className="col-12 offset-md-2 col-md-8 text-center">
                {
                  submissao && submissao.language === 'blockly' ?
                    <B.BlocklyComponent
                      ref={this.simpleWorkspace}
                      readOnly={true}
                      trashcan={true}
                      media={'media/'}
                      move={{
                        scrollbars: true,
                        drag: true,
                        wheel: true
                      }}
                      initialXml={isXml(submissao && submissao.answer) ? submissao && submissao.answer : ''}>
                      <B.Category name="Texto" colour="20">
                        <B.Block type="text" />
                        <B.Block type="text_print" />
                        <B.Block type="text_prompt" />
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
                      mode={submissao && submissao.language}
                      theme="monokai"
                      focus={false}
                      value={submissao ? submissao.answer : ""}
                      fontSize={14}
                      width="100%"
                      showPrintMargin={false}
                      name="ACE_EDITOR"
                      showGutter={true}
                      highlightActiveLine={true}
                      readOnly={true}
                    />
                }
              </div>
            </Row>
          </>
        </SwalModal>

        <SwalModal
          show={showModalCSV}
          handleModal={() => this.setState({ showModalCSV: false })}
        >
          <Row>
            <Col xs={12} textCenter>
              {csvData && <CSVLink
                data={csvData}
                filename={`${turma && turma.name}-${moment().local().format("YYYY-MM-DD-HH-mm")}.csv`}
                className={'btn btn-primary btn-lg'}
                onClick={() => this.setState({ showModalCSV: false })}
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
