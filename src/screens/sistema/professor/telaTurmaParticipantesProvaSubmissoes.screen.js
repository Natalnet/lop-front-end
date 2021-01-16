import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Pagination } from "../../../components/ui/navs";
import profileImg from "../../../assets/perfil.png";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import api from "../../../services/api";
import moment from "moment";
import SwalModal from "../../../components/ui/modal/swalModal.component";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import "katex/dist/katex.min.css";
import AceEditorWrapper from "../../../components/templates/aceEditorWrapper.template";
import * as B from "../../../components/ui/blockly";
import { isXml } from '../../../util/auxiliaryFunctions.util';
import { FaCheck } from 'react-icons/fa';

const lista = {
  backgroundColor: "white",
};

export default class HomesubmissoesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingInfoTurma: true,
      submissoes: [],
      usuario: null,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      prova: "",
      questao: "",
      showModal: false,
      loadingSubmissoes: false,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      docsPerPage: 15,
      submissao: "",
      showModalInfo: false,
      isUpdateSubmission: false,
      teacherNote: ''
    };
    this.handlePage = this.handlePage.bind(this);
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getSubmissoes();

    const { turma } = this.state;
    document.title = `${turma && turma.name} - Submissões`;
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
    const { id, idProva, idExercicio, idUser } = this.props.match.params;
    const { numPageAtual, docsPerPage } = this.state;
    let query = `?idClass=${id}`;
    query += `&idTest=${idProva}`;
    query += `&idQuestion=${idExercicio}`;
    query += `&idUser=${idUser}`;
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
        usuario: response.data.user,
        prova: response.data.test,
        questao: response.data.question,
      });
    } catch (err) {
      this.setState({ loadingSubmissoes: false });
      console.log(err);
    }
  }

  async updateSubmissionByDiscursiveQuestion() {
    const { id, idProva, idExercicio, idUser } = this.props.match.params;
    //console.log('this.teacherNote: ', this.state.teacherNote)
    const request = {
      idClass: id,
      idTest: idProva,
      idQuestion: idExercicio,
      idUser,
      hitPercentage: this.state.teacherNote
    }
    this.setState({ isUpdateSubmission: true })
    try {
      await api.put('/submission/discursiveQuestion', request)
      this.setState({
        isUpdateSubmission: false,
        teacherNote: ''
      })
      this.handleCloseshowModalInfo()
      this.getSubmissoes();

    }
    catch (err) {
      this.setState({ isUpdateSubmission: false })
      console.log(err);
    }
  }

  handleShowModalInfo(submissao) {
    //console.log(question);
    this.setState({
      submissao: submissao,
      teacherNote: submissao.hitPercentage ? submissao.hitPercentage : '',
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

  render() {
    const {
      submissoes,
      showModalInfo,
      prova,
      questao,
      loadingSubmissoes,
      numPageAtual,
      totalPages,
      submissao,
      loadingInfoTurma,
      turma,
      usuario,
      isUpdateSubmission,
      teacherNote,
    } = this.state;
    return (
      <TemplateSistema
        active="participantes"
        {...this.props}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
                <h5 style={{ margin: "0px", display: "inline" }}>
                  <i className="fa fa-users mr-2" aria-hidden="true" />
                  {turma && turma.name} - {turma && turma.year}.
                  {turma && turma.semester}
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  <Link
                    to={`/professor/turma/${this.props.match.params.id}/participantes`}
                  >
                    Participantes
                </Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  <Link
                    to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/listas`}
                  >
                    {usuario ? (
                      `${usuario.name} `
                    ) : (
                        <div
                          style={{
                            width: "140px",
                            backgroundColor: "#e5e5e5",
                            height: "12px",
                            display: "inline-block",
                          }}
                        />
                      )}
                  </Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  <Link
                    to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/provas/${this.props.match.params.idProva}/exercicios`}
                  >
                    {prova ? (
                      `${prova.title}`
                    ) : (
                        <div
                          style={{
                            width: "140px",
                            backgroundColor: "#e5e5e5",
                            height: "12px",
                            display: "inline-block",
                          }}
                        />
                      )}
                  </Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  {questao ? (
                    `${questao.title}`
                  ) : (
                      <div
                        style={{
                          width: "140px",
                          backgroundColor: "#e5e5e5",
                          height: "12px",
                          display: "inline-block",
                        }}
                      />
                    )}
                </h5>
              )}
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
                              backgroundImage: `url(${submission.user.urlImage || profileImg})`,
                            }}
                          />
                        </td>
                        <td
                          style={{
                            color: `${parseFloat(submission.hitPercentage) === 100
                              ? "#5eba00"
                              : "#f00"
                              }`,
                          }}
                        >
                          <b>{submission.hitPercentage === null ? 'Não atribuida' : `${parseFloat(submission.hitPercentage)}%`}</b>
                        </td>
                        <td>
                          {parseInt(submission.timeConsuming / 1000 / 60)}min
                        {parseInt((submission.timeConsuming / 1000) % 60)}seg
                      </td>
                        <td>{submission.ip}</td>
                        <td>{submission.char_change_number}</td>
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
          </div>
        </div>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12 text-center">
            <Pagination
              count={totalPages}
              page={Number(numPageAtual)}
              onChange={this.handlePage}
              color="primary"
              size="large"
              disabled={loadingSubmissoes}
            />
          </div>
        </div>

        <Dialog
          open={showModalInfo}
          maxWidth={'lg'}
          onClose={() => this.handleCloseshowModalInfo()}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <DialogTitle id="contained-modal-title-vcenter">
            < Row mb={15}>
              <Col xs={12}>
                <div
                  className='h-100'
                  style={{
                    width: '1000px',
                    maxWidth: '100%'
                  }}
                >
                  <SunEditor
                    lang="pt_br"
                    height="auto"
                    minWidth="1200px"
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
                </div>
              </Col>
            </Row>
          </DialogTitle>
          <DialogContent>
            {submissao && submissao.question.type === 'PROGRAMMING' &&
              <Row>
                <div className="col-12 offset-md-2 col-md-8 text-center">
                  {
                    submissao.language === 'blockly' ?
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
                        initialXml={isXml(submissao.answer) ? submissao.answer : ''}>
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
                        mode={submissao.language}
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
            }
            {submissao && submissao.question.type === 'DISCURSIVE' && (
              <Row>
                <Col xs={12}>
                  <textarea
                    className='form-control'
                    readOnly
                    value={submissao ? submissao.answer : ""}
                  />
                </Col>
                <div className='mb-4'>&nbsp;</div>
                <Col xs={12}>
                  <label htmlFor="selectDifficulty">
                    Nota do professor: (0 a 100)
                          </label>
                  <input
                    style={{ textAlign: "center" }}
                    className='form-control'
                    onChange={(e) => this.setState({ teacherNote: e.target.value })}
                    type='number'
                    min='0'
                    max='100'
                    disabled={isUpdateSubmission}
                    value={teacherNote}
                  ></input>
                </Col>
                <div className='mb-2'>&nbsp;</div>

                <Col xs={12}>

                  <button
                    className={`w-100 btn btn-primary ${isUpdateSubmission && 'btn-loading'}`}
                    onClick={() => this.updateSubmissionByDiscursiveQuestion()}
                    disabled={teacherNote === '' || Number(teacherNote) < 0 || Number(teacherNote) > 100}
                  >
                    Atribuir
                  </button>
                </Col>
              </Row>
            )}
            {submissao && submissao.question.type === 'OBJECTIVE' && (
              <Row>
                <>
                  {
                    submissao && submissao.question.alternatives.map((alternative, i) => (
                      <React.Fragment key={alternative.code}>
                        <div className="col-1">
                          <div
                            className='w-100 d-flex justify-content-center'
                          >
                            <span className='mr-2 d-flex align-items-center'>
                              <FaCheck
                                size={15}
                                color={`rgb(94, 186, 0, ${alternative.isCorrect ? '100' : '0'})`}
                              />
                            </span>
                            <Radio
                              value={alternative.code}
                              checked={alternative.code === submissao.answer}
                              inputProps={{ 'aria-label': i }}
                              disabled
                              color="primary"
                            />
                          </div>
                        </div>

                        <div className='col-11 mt-2'>
                          <div className='w-100 d-flex'>
                            <span className='mr-4 '>
                              {`${String.fromCharCode(65 + i)})`}
                            </span>
                            <div
                              className='w-100 '
                            // ref={(el) => editorRef.current[i] = el}
                            >
                              <SunEditor
                                lang="pt_br"
                                height="auto"
                                disable={true}
                                showToolbar={false}
                                setContents={alternative.description}
                                setDefaultStyle="font-size: 15px; text-align: justify"
                                // onLoad={() => {
                                //   editorRef.current[i].classList.add('sun-editor-wrap')
                                // }}
                                setOptions={{
                                  toolbarContainer: '#toolbar_container',
                                  resizingBar: false,
                                  katex: katex,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  }
                </>
              </Row>
            )}

          </DialogContent>
        </Dialog>
        {/* <SwalModal
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
            <div className="row">
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
            </div>
          </>
        </SwalModal> */}
      </TemplateSistema>
    );
  }
}
