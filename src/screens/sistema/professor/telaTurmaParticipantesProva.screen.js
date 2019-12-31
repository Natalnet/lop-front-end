import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
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
      prova: '',
      usuario: '',
      loandingProva: true,
      loadingInfoTurma: true,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",        
      todasprovas: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getProva();
    const {turma,prova} = this.state
    document.title = `${turma && turma.name} - ${prova && prova.title}`;
  }
  async getInfoTurma(){
    const id = this.props.match.params.id
    const {myClasses} = this.state
    if(myClasses && typeof myClasses==="object"){
        const index = myClasses.map(c=>c.id).indexOf(id)
        if(index!==-1){
            this.setState({
                turma:myClasses[index]
            })
        }
        this.setState({loadingInfoTurma:false})
        return null
    }
    try{
        const response = await api.get(`/class/${id}`)
        this.setState({
            turma:response.data,
            loadingInfoTurma:false,
        })
    }
    catch(err){
        this.setState({loadingInfoTurma:false})
        console.log(err);
    }
  }
  async getProva() {
    try {
      const { id, idProva, idUser } = this.props.match.params;
      let query = `?idClass=${id}`
      query += `&idUser=${idUser}`
      const response = await api.get(`/test/${idProva}${query}`);
      console.log("provas");
      console.log(response.data);
      this.setState({
        prova: response.data.test,
        usuario: response.data.user,
        loandingProva: false
      });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const {
      loadingInfoTurma,
      turma,
      loandingProva,
      prova,
      usuario
    } = this.state;

    return (
      <TemplateSistema
        {...this.props}
        active={"participantes"}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{margin:'0px',display:'inline'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                <i className="fa fa-angle-left ml-2 mr-2"/> 
                <Link to={`/professor/turma/${this.props.match.params.id}/participantes`}>
                  Participantes
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/>
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/listas`}
                >
                  {usuario?`${usuario.name} - ${usuario.enrollment}`:<div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/>
                {prova?`${prova.title}`:<div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
              </h5>
            )}
          </Col>
        </Row>
        {loandingProva ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={15}>
              <Col xs={12}>
                <Card>
                  <CardHead>
                    <Col xs={4} pl={0}>
                      <h4 style={{ margin: "0px" }}>
                        <b>{prova && prova.title}</b>
                      </h4>
                    </Col>

                    <ProgressBar 
                      numQuestions={prova && prova.questionsCount}
                      numQuestionsCompleted={prova && prova.questionsCompletedSumissionsCount}
                      dateBegin={prova && prova.classHasTest.createdAt}
                      width={100}
                    />
                  </CardHead>
                  <CardBody>
                    <Row>
                      {prova &&
                        prova.questions.map((question, j) => (
                          <Fragment key={j}>
                            <Col xs={12} md={6}>
                              <Card>
                                <CardHead>
                                  <CardTitle>
                                    <b>
                                      {question.title}&nbsp;
                                      {question.isCorrect? (
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
                                        "#collapse2" + j + (prova && prova.id)
                                      }
                                      aria-expanded={false}
                                    />
                                  </CardOptions>
                                </CardHead>
                                <div
                                  className="collapse"
                                  id={"collapse2" + j + (prova && prova.id)}
                                >
                                  <CardBody>{question.description}</CardBody>
                                </div>
                                <CardFooter>
                                  Submissões: {question.submissionsCount}
                                  <Link
                                    to={`/professor/turma/${this.props.match.params.id}/participantes/${usuario.id}/provas/${prova && prova.id}/exercicio/${question.id}`}
                                  >
                                    <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                      Ver submissões{" "}
                                      <i className="fa fa-wpexplorer" />
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
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
