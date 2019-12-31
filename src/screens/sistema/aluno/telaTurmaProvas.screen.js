import React, { Component, Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api, { baseUrlBackend } from "../../../services/api";
import Swal from "sweetalert2";
import generateHash from "../../../util/funçoesAuxiliares/generateHash";
import "katex/dist/katex.min.css";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import socket from "socket.io-client";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Provas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provas: [],
      loadingInfoTurma: true,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",      
      loandingListas: false,
      password: ""
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getProvas();
    this.getProvasRealTime();
    
    document.title = `${this.state.turma.name} - provas`;
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

  async getProvas() {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`
    try {
      this.setState({ loandingListas: true });
      const response = await api.get(`/test${query}`);
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
  getProvasRealTime() {
    const io = socket(baseUrlBackend);
    io.emit("connectRoonClass", this.props.match.params.id);

    io.on("changeStatusTest", reponse => {
      let { provas } = this.state;
      provas = provas.map(prova => {
        const provaCopia = JSON.parse(JSON.stringify(prova));
        if (reponse.idTest === prova.id) {
          provaCopia.status = reponse.status;
        }
        return provaCopia;
      });
      this.setState({ provas });
    });
    io.on("addTestToClass", response => {
      let { provas } = this.state;
      this.setState({ provas: [...provas, response] });
    });
    io.on("removeTestFromClass", response => {
      let { provas } = this.state;
      this.setState({
        provas: provas.filter(prova => prova.id !== response.id)
      });
    });
  }
  async acessar(prova) {
    const url = `/aluno/turma/${this.props.match.params.id}/prova/${prova.id}`;
    const password = sessionStorage.getItem(`passwordTest-${prova.id}`);
    const hashCode = `${generateHash(prova.password)}-${prova.id}`;
    try {
      if (password && password === hashCode) {
        this.props.history.push(url);
      } else {
        const { value } = await Swal.fire({
          title: "Senha para acessar a prova",
          confirmButtonText: "Acessar",
          cancelButtonText: "Cancelar",
          input: "password",
          showCancelButton: true,
          inputValue: "", //valor inicial
          inputValidator: value => {
            if (!value) {
              return "Você precisa escrever algo!";
            } else if (value !== prova.password) {
              return "Senha incorreta :(";
            }
          }
        });
        if (value) {
          //gera hash da senha
          sessionStorage.setItem(`passwordTest-${prova.id}`, hashCode);
          this.props.history.push(url);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { loadingInfoTurma, turma, provas } = this.state;
    const {  loandingListas } = this.state;
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma?
              <div className="loader"  style={{margin:'0px auto'}}></div>
              :
              <h5 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                <i className="fa fa-angle-left ml-2 mr-2"/> Provas
              </h5>                        
            }
          </Col>
        </Row>
        <Row mb={15}>
          {loandingListas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            provas.map((prova, i) => {
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
                          numQuestions={prova.questionsCount}
                          numQuestionsCompleted={prova.questionsCompletedSumissionsCount}
                          dateBegin={prova.classHasTest.createdAt}
                        />
                        <CardOptions>
                          {prova.status === "ABERTA" ? (
                            <button
                              className="btn btn-success mr-2"
                              style={{ float: "right" }}
                              onClick={() => this.acessar(prova)}
                            >
                              Acessar <i className="fa fa-wpexplorer" />
                            </button>
                          ) : null}
                        </CardOptions>
                      </CardHead>
                    </Card>
                  </Col>
                </Fragment>
              );
            })
          )}
        </Row>
      </TemplateSistema>
    );
  }
}
