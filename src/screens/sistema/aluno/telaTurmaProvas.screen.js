import React, { Component, Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api,{baseUrlBackend} from "../../../services/api";
import Swal from "sweetalert2";
import bcrypt from 'bcryptjs'
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
      loandingListas: false,

      todasListas: [],
      password: ""
    };
  }

  async componentDidMount() {
    this.getProvas();
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

  getProvasRealTime(){
    const io = socket(baseUrlBackend);
    io.emit("connectRoonClass",this.props.match.params.id);

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
    io.on("addTestToClass", response =>{
      let {provas} = this.state
      this.setState({provas: [...provas,response]})
    });
    io.on("removeTestFromClass", response =>{
      let {provas} = this.state
      this.setState({
          provas: provas.filter(prova=>prova.id!==response.id)
      })
    });
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
              return 'Você precisa escrever algo!'
            }
            else if(value !== prova.password){
              return "Senha incorreta :("
            }
          }
        })
        if(value){
          //gera hash da senha
          const hashCode = value.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
          sessionStorage.setItem('passwordTest',hashCode)
          this.props.history.push(url)
        }
      }

    }
    catch(err){

    }
  }


  render() {
    const {
      loadingInfoTurma,
      turma,
      todasListas,
      provas
    } = this.state;
    const {
      contentInputSeach,
      fieldFilter,
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
