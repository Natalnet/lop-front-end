import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import generateHash from "../../../util/funçoesAuxiliares/generateHash";
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
      prova: null,
      loandingProva: false,
      loadingInfoTurma: true,
      testTitle:"" ,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",    
    };
  }
  
  async componentDidMount() {
    await this.getInfoTurma();
    this.getProva();
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
    const {id,idTest} = this.props.match.params;
    const idClass = id
    let lists = sessionStorage.getItem("lists")
    if(lists && typeof JSON.parse(lists)==="object"){  
      lists = JSON.parse(lists)      
      const index = lists.map(l=>l.id).indexOf(idTest)
      if(index!==-1){
          this.setState({
            testTitle:lists[index].title
          })
      }
    }
    let query = `?idClass=${idClass}`
    //const {turma} = this.state
    try {
      this.setState({loandingProva: true})
      const response = await api.get(`/test/${idTest}${query}`);
      const prova = response.data
      console.log('prova:',prova)
      const password = sessionStorage.getItem(`passwordTest-${prova && prova.id}`);
      const hashCode = `${generateHash(prova && prova.password)}-${prova && prova.id}`;
      if ((prova && prova.status === "FECHADA") || (!password) || (password !== hashCode)) {
        this.props.history.push(`/aluno/turma/${id}/provas`);
      } else {
        this.setState({
          prova,
          loandingProva: false,
          testTitle:prova.title
        });
        
        
      }
    } catch (err) {
      console.log(err);
    }
  }

  RecolherProva = e => {};

  render() {
    const { loadingInfoTurma, turma, loandingProva, prova ,testTitle} = this.state;
    const questions = prova && prova.questions
    const questionsCompleted = prova && prova.questions.filter(q => q.correctSumissionsCount>0);
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{margin:'0px',display:'inline'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
              {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
              <i className="fa fa-angle-left ml-2 mr-2"/> 
              <Link to={`/aluno/turma/${this.props.match.params.id}/provas`}>
                Provas
              </Link>
              <i className="fa fa-angle-left ml-2 mr-2"/>
              {testTitle || <div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
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
                      numQuestions={prova && questions.length}
                      numQuestionsCompleted={prova && questionsCompleted.length}
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
                                      {question.correctSumissionsCount > 0 ? (
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
                                  Suas submissões: {question.submissionsCount}
                                  <Link
                                    to={`/aluno/turma/${this.props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}
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
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
