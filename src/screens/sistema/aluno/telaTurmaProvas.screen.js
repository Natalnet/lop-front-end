import React, { Component, Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api,{baseUrlBackend} from "../../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Modal, ProgressBar } from "react-bootstrap";
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
import socket from "socket.io-client";

export default class Provas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      provas: [],
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      loandingTodasListas: true,
      loandingListas: false,
      showModalListas: false,
      showModalInfo: false,
      todasListas: [],
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      contentInputSeach: "",
      fieldFilter: "title",
      questions: [],
      password: ""
    };
  }

  async componentDidMount() {
    this.getProvas();
    //this.getTodasProvas();
    this.getProvasRealTime()

    await this.getInfoTurma();
    document.title = `${this.state.turma.name} - provas`;
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

  async getProvas() {
    const id = this.props.match.params.id;
    try {
      this.setState({ loandingListas: true });
      const response = await api.get(`/class/${id}/tests`);
      console.log("provas");
      console.log(response.data);
      this.setState({
        provas: [...response.data],
        loandingListas: false
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }

  async getTodasProvas() {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;
    try {
      this.setState({ loandingTodasListas: true });
      const id = this.props.match.params.id;
      const response = await api.get(
        `/test/class/${id}/page/${numPageAtual}?${query}`
      );
      console.log("todasListas");
      console.log(response.data.docs);
      this.setState({
        todasListas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        loandingTodasListas: false
      });
    } catch (err) {
      this.setState({ loandingTodasListas: false });
      console.log(err);
    }
  }
  getProvasRealTime(){
    const io = socket(baseUrlBackend);
    io.emit("connectRoonStatusTest",this.props.match.params.id);
    io.on("changeStatusTest", reponse => {
      let {provas} = this.state
      provas = provas.map(prova=>{
        const provaCopia = JSON.parse(JSON.stringify(prova))
        if(reponse.idTest===prova.id){
          provaCopia.status = reponse.status
        }
        return provaCopia
      })
      this.setState({provas})
    })
  }
  async acessar(prova){
    const url = `/aluno/turma/${this.props.match.params.id}/prova/${prova.id}` 
    try{
      if(sessionStorage.getItem('passwordTest')){
        this.props.history.push(url)
      }
      else{
        const {value} = await Swal.fire({
          title:'Senha para acessar a prova',
          input:'text',
          confirmButtonText:'Acessar',
          cancelButtonText:'Cancelar',
          input: 'password',
          showCancelButton: true,
          inputValue:'',//valor inicial
          inputValidator:(value)=>{
            if(!value){
              return 'Voçê precisa escrever algo!'
            }
            else if(value !== prova.password){
              return "Senha incorreta :("
            }
          }
        })
        if(value){
          sessionStorage.setItem('passwordTest',value)
          this.props.history.push(url)
        }
      }

    }
    catch(err){

    }
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage
      },
      () => this.getTodasProvas()
    );
  }
  handleShowModalInfo(questions) {
    this.setState({
      showModalInfo: true,
      questions: [...questions]
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }
  handleShowModalListas(e) {
    this.setState({ showModalListas: true });
  }
  handleCloseshowModalListas(e) {
    this.setState({ showModalListas: false });
  }

  handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState(
      {
        fieldFilter: e.target.value
      } /*,()=>this.getTodasProvas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value
      } /*,()=>this.getTodasProvas()*/
    );
  }
  filterSeash() {
    this.getTodasProvas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
      },
      () => this.getTodasProvas()
    );
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      todasListas,
      loandingTodasListas,
      totalPages,
      numPageAtual,
      provas
    } = this.state;
    const {
      contentInputSeach,
      fieldFilter,
      showModalListas,
      questions,
      showModalInfo,
      loandingListas
    } = this.state;
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma.name} - {turma.year}.{turma.semester || 1}
              </h3>
            )}
          </div>
        </div>

        <Row mb={15}>
          {loandingListas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            provas.map((prova, i) => {
              const questions = prova.questions;
              const questionsCompleted = prova.questions.filter(
                q => q.completed
              );
              const completed = (
                (questionsCompleted.length / questions.length) *
                100
              ).toFixed(2);
              return (
              <Fragment key={prova.id}>
                <Col xs={12}>
                  <Card key={prova.id} style={{ margin: "2px" }}>
                    <CardHead>
                      <Col xs={5}>
                        <h4 style={{ margin: "0px" }}>
                          <b>{prova.title}</b>
                        </h4>
                      </Col>
                      <ProgressBar
                        now={completed}
                        label={`${completed}%`}
                        style={{ width: "45%" }}
                      />
                      <CardOptions>
                      {
                        prova.status==="ABERTA"
                      ?
                        <button
                          className="btn btn-success mr-2"
                          style={{ float: "right" }}
                          onClick={()=>this.acessar(prova)}
                        >
                          Acessar <i className="fa fa-wpexplorer" />
                        </button>
                      :null
                      }

                        <div
                          className="modal fade"
                          id="ModalRecolherProva"
                          tabindex="-1"
                          role="dialog"
                          aria-hidden="true"
                        >
                          <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                          >
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  Senha para acessar a prova
                                </h5>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                <label htmlFor="inputSenha">
                                  <b>
                                    Para acessar a prova e necessário informar a
                                    Senha:
                                  </b>
                                </label>
                                <input
                                  id="inputSenha"
                                  type="password"
                                  value={this.state.password}
                                  className="form-control"
                                  placeholder="Senha para acessar prova"
                                />
                              </div>
                              <div className="modal-footer">
                                <Link
                                  to={`/aluno/turma/${this.props.match.params.id}/prova/${prova.id}`}
                                >
                                  <button type="button" className="btn btn-success">
                                    Acessar Prova
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardOptions>
                    </CardHead>
                  </Card>
                </Col>
                </Fragment>
              );
            })
          )}
        </Row>

        <Modal
          show={showModalListas}
          onHide={this.handleCloseshowModalListas.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Provas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Fragment>
              <Row mb={15}>
                <div className=" col-12">
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
                      { value: "code", content: "Código" }
                    ]}
                    clearContentInputSeach={this.clearContentInputSeach.bind(
                      this
                    )}
                    loading={loandingTodasListas}
                  />
                </div>
              </Row>
              <div className="row">
                {loandingTodasListas ? (
                  <div className="loader" style={{ margin: "0px auto" }} />
                ) : (
                  todasListas.map((prova, index) => (
                    <div key={prova.id} className="col-6">
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
                                onClick={() => this.inserirProva(prova.id)}
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
                            <b>Questões: </b> <br />
                            <br />
                            {prova.questions.map((question, index) => (
                              <div key={question.id}>
                                <p>{index + 1 + " - " + question.title}</p>
                              </div>
                            ))}
                          </CardBody>
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </div>
              <div className="row">
                <div className="col-12 text-center">
                  <NavPagination
                    totalPages={totalPages}
                    pageAtual={numPageAtual}
                    handlePage={this.handlePage.bind(this)}
                  />
                </div>
              </div>
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
