import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lista: null,
      loandingLista: true,
      showModalDate:false,
      loadingInfoTurma: true,
      loadingDateLimit:false,
      dateLimit:'',
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      todasListas: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getLista();
    const {turma,lista} = this.state
    document.title = `${turma && turma.name} - ${lista && lista.title}`;
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
  async getLista() {
    try {
      const idClass = this.props.match.params.id;
      const idLista = this.props.match.params.idLista;
      const response = await api.get(
        `/listQuestion/${idLista}/class/${idClass}`
      );
      console.log("lista");
      console.log(response.data);
      const lista = response.data
      let dateLimit = ''
      if(lista.classHasListQuestion.submissionDeadline){
        dateLimit = new Date(lista.classHasListQuestion.submissionDeadline)
        const yarn = dateLimit.getFullYear()
        const month = dateLimit.getMonth()+1
        const day = dateLimit.getDate()
        dateLimit = `${yarn}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
      }
      console.log('dateLimit');
      console.log(dateLimit);
      this.setState({
        lista,
        dateLimit,
        loandingLista: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addDateLimit(list){
    const idClass = this.props.match.params.id;
    const idList = list.id
    const query = `?idList=${idList}&idClass=${idClass}`
    const {dateLimit} = this.state
    if(dateLimit){
      const request = {
        submissionDeadline:dateLimit
      }
      try{
        this.setState({loadingDateLimit:true})
        await api.put(`/classHasListQuestion/update${query}`,request)
        this.handleCloseShowModalDate()
        this.setState({loadingDateLimit:false})
        this.getLista()
        Swal.fire({
          type: "success",
          title: "Data limite para submissoões adicionada com sucesso!"
        });
      }
      catch(err){
        console.log(err);
        this.setState({loadingDateLimit:false})
        Swal.fire({
          type: "error",
          title: "ops... data limite não pôde ser adicionada"
        });
      }
    }
  }
  changeDate(e){
    console.log('data');
    console.log(e.target.value);
    this.setState({dateLimit: e.target.value})
  }
  handleShowModalDate(){
      this.setState({
          showModalDate:true,
      })
  }
  handleCloseShowModalDate(e){
      this.setState({showModalDate:false})
  }
  render() {
    const { loadingInfoTurma, turma,loadingDateLimit,showModalDate,dateLimit, loandingLista, lista } = this.state;
    const questions = lista && lista.questions
    const questionsCompleted =
      lista && lista.questions.filter(q => q.completed);

    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}
              </h3>
            )}
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={6}>
            <Link
              to={`/professor/turma/${this.props.match.params.id}/listas`}
            >
              <button className="btn btn-success mr-2">
                <i className="fa fa-arrow-left" /> Voltar para listas{" "}
                <i className="fa fa-file-text" />
              </button>
            </Link>
          </Col>
          <Col xs={6}>
            <button
              className={`btn btn-primary ${loandingLista && 'btn-loading'}`}
              style={{float:'right'}}
              onClick={()=>this.handleShowModalDate()}
            >
              {lista && dateLimit?
                'Editar data limite para submissões'
                :
                'Adicionar data limite para submmissões'
              }
            </button>
          </Col>
        </Row>

        </>
        {loandingLista ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>

            <Row mb={15}>
              <Col xs={12}>
                <Card>
                  <CardHead>
                    <Col xs={4} pl={0}>
                      <h4 style={{ margin: "0px" }}>
                        <b>{lista && lista.title}</b>
                      </h4>
                    </Col>
                    <ProgressBar 
                      numQuestions={lista && questions.length}
                      numQuestionsCompleted={lista && questionsCompleted.length}
                      dateBegin={lista && lista.classHasListQuestion.createdAt}
                      dateEnd={lista && lista.classHasListQuestion.submissionDeadline}
                      width={100}
                    />                  
                  </CardHead>
                  <CardBody>
                    <Row>
                      {lista &&
                        lista.questions.map((question, j) => (
                          <Fragment key={j}>
                            <Col xs={12} md={6}>
                              <Card>
                                <CardHead>
                                  <CardTitle>
                                    <b>
                                      {question.title}&nbsp;
                                      {question.completed ? (
                                        <i
                                          className="fa fa-check"
                                          style={{ color: "#0f0" }}
                                        />
                                      ) : null}
                                    </b>
                                  </CardTitle>
                                  <CardOptions>
                                    <i
                                      title="Ver descrição"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "25px"
                                      }}
                                      className={`fe fe-chevron-down`}
                                      data-toggle="collapse"
                                      data-target={
                                        "#collapse2" + j + (lista && lista.id)
                                      }
                                      aria-expanded={false}
                                    />
                                  </CardOptions>
                                </CardHead>
                                <div
                                  className="collapse"
                                  id={"collapse2" + j + (lista && lista.id)}
                                >
                                  <CardBody>{question.description}</CardBody>
                                </div>
                                <CardFooter>
                                  Suas submissões: {question.submissions.length}
                                  <Link
                                    to={`/professor/turma/${this.props.match.params.id}/lista/${lista && lista.id}/exercicio/${question.id}`}
                                  >
                                    <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                      Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            </Col>
                          </Fragment>
                        ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Modal
              show={showModalDate}
              onHide={this.handleCloseShowModalDate.bind(this)}
              size="lg"
              aria-labelledby="contained-modal-title"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title">
                  {`Adicionar data limite para as submissões na lista '${lista && lista.title}'`} 
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={12} textCenter>
                    <input type='date' value={dateLimit} onChange={(e)=>this.changeDate(e)}/> - 23:59:59
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className={`btn btn-primary ${loadingDateLimit && 'btn-loading'}`}
                  onClick={()=>this.addDateLimit(lista)}
                >
                  Adicionar
                </button>
                <button
                  className={`btn btn-danger  ${loadingDateLimit && 'btn-loading'}`}
                  onClick={this.handleCloseShowModalDate.bind(this)}
                >
                  Não adicionar data limite
                </button>
              </Modal.Footer>
            </Modal>
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
