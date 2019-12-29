import React, { Component, Fragment } from "react";
import api, { baseUrlBackend } from "../../../services/api";
import Swal from "sweetalert2";

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/TurmasAbertasAlunos/cardHead.component";
import CardOptions from "components/ui/card/TurmasAbertasAlunos/cardOptions.component";
//import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/TurmasAbertasAlunos/cardBody.component";
import CardFooter from "components/ui/card/TurmasAbertasAlunos/cardFooter.component";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

import socket from "socket.io-client";

export default class HomeAlunoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turmasAbertas: [],
      minhasTurmas: [],
      loadingMinhasTurmas:false,
      totalPages: 0,
      solicitacoes: [],
      loandingTurmasAbertas: false,
      descriptions: [],
      code: "",
      fieldFilter: "code"
    };
  }
  async componentDidMount() {
    
    this.getTurmasAbertasRealTime();
    document.title = "Início | LoP";
  }
  async getMinhasTurmas() {
    let myClasses = sessionStorage.getItem('myClasses')
    if(myClasses && typeof JSON.parse(myClasses)==="object"){
      myClasses = JSON.parse(myClasses)
      console.log("minhas turmas",myClasses);
      this.setState({minhasTurmas:myClasses})
      return null
    }
    let query = `?myClasses=yes`
    try {
      this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/class${query}`);
      console.log("minhas turmas",response.data);
      this.setState({
        minhasTurmas: [...response.data],
        loandingTurmasAbertas: false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getSolicitacoes(loading = true) {
    let query = `?mySolicitations=yes`
    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/solicitation${query}`);
      console.log("minhas soicitações");
      console.log(response.data);
      this.setState({
        solicitacoes: [...response.data]
        //loandingTurmasAbertas:false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertas(loading = true) {
    const {code,minhasTurmas} = this.state;
    let query = `?code=${code || 'null'}`;
    query += `&state=ATIVA`
    query += `&idNotIn=${minhasTurmas.map(t=>t.id).join(" ")}`
    
    try {
      if (loading) this.setState({ loandingTurmasAbertas: true });
      const response = await api.get(`/class${query}`);
      console.log("turmas:");
      console.log(response.data);
      this.setState({
        turmasAbertas: response.data,
        loandingTurmasAbertas: false
      });
    } catch (err) {
      this.setState({ loandingTurmasAbertas: false });
      console.log(err);
    }
  }
  async getTurmasAbertasRealTime() {
    const io = socket(baseUrlBackend);
    io.emit("connectRoonUser", sessionStorage.getItem("user.id"));

    io.on("RejectSolicitation", async response => {
      const {solicitacoes} = this.state
      this.setState({
        solicitacoes:solicitacoes.filter(s=>s.class_id!==response)
      })
    });

    io.on("AcceptSolicitation", response => {
      const {turmasAbertas} = this.state
      const myNewClass = turmasAbertas.map(t=>{
        return {
          id:t.id,
          title:t.title
        }
      })
      let myClasses = sessionStorage.getItem('myClasses')
      if(myClasses && typeof JSON.parse(myClasses)==="object"){
        myClasses = [...JSON.parse(myClasses),...myNewClass]
      }
      else{
        myClasses = myNewClass
      }
      sessionStorage.setItem('myClasses',JSON.stringify(myClasses))
      console.log("minhas turmas",myClasses);
      this.setState({
        minhasTurmas:myClasses,
        turmasAbertas:turmasAbertas.filter(t=>t.id!==response),
      })
      console.log("acabou de ser adicionado à turma")
    });
    
  }
  async solicitarAcesso(idClass) {
    const request = {idClass}
    try {
      Swal.fire({
        title: "Processando solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      const response = await api.post(`/solicitation/store`,request);
      console.log("solicitação:",response.data);
      const {solicitacoes} = this.state
      this.setState({
        solicitacoes:[...solicitacoes,response.data]
      })

      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação feita com sucesso!"
      });
      //this.setState({solicitando:''})
    } catch (err) {
      Swal.hideLoading();

      Swal.fire({
        type: "error",
        title: "ops... Falha ao tentar fazer solicitação"
      });
      //this.setState({solicitando:''})
    }
  }
  async cancelarSolicitacao(idClass) {
    //sessionStorage.getItem("user.id");
    let query = `?idClass=${idClass}`
    try {
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title: "Cancelando Solicitação",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.delete(`/solicitation/delete${query}`);
      const {solicitacoes} = this.state
      this.setState({
        solicitacoes:solicitacoes.filter(s=>s.class_id!==idClass)
      })
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Solicitação cancelada!"
      });
      //console.log(response);

      await this.setState({ solicitando: "" });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Erro ao cancelar solicitação"
      });
      //this.setState({solicitando:''})
    }
  }
  async handleCode(e) {
    console.log(e.target.value);
    this.setState({
      code: e.target.value
    });
  }
  async filterSeash(e) {
    await this.getMinhasTurmas()
    await this.getSolicitacoes();
    this.getTurmasAbertas();
  }
  async handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState({
      fieldFilter: e.target.value
    });
  }
  async clearcode() {
    this.setState({
      code: ""
    });
    await this.getMinhasTurmas();
    await this.getSolicitacoes();
    this.getTurmasAbertas();
  }

  render() {
    const {
      solicitacoes,
      turmasAbertas,
      loandingTurmasAbertas,
      code
    } = this.state;
    return (
      <TemplateSistema active="turmasAbertas">
        <Row mb={15}>
          <Col xs={12} >
              <h5 style={{margin:'0px'}}> 
                Perquise turmas abertas pelo código
              </h5>
          </Col>
        </Row>
        <Row mb={24}>
          <Col xs={12}>
            <InputGroupo
              placeholder={`Perquise pelo Código`}
              value={code}
              handleContentInputSeach ={this.handleCode.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[{ value: "code", content: "Código" }]}
              clearcode={this.clearcode.bind(this)}
              loading={loandingTurmasAbertas}
            />
          </Col>
        </Row>
        <Row>
          {turmasAbertas.map((turma) => {
                return (
                  <Fragment key={turma.id}>
                    <Col xs={12} lg={6}>
                      <Card>
                        <CardHead
                          name={turma.name}
                          code={turma.code}
                          semestre={turma.semester}
                          ano={turma.year}
                        />
                        <div className="row">
                          <div className="col-3">
                            <CardOptions linguagens={turma.languages} />
                          </div>
                          <div className="col-9" style={{ paddingLeft: "0px" }}>
                            <CardBody description={turma.description} />
                          </div>
                        </div>
                        <CardFooter>
                          {solicitacoes
                            .map(s => s.class_id)
                            .includes(turma.id) ? (
                            <button
                              onClick={() => this.cancelarSolicitacao(turma.id)}
                              className="btn btn-danger"
                              style={{
                                float: "right",
                                margin: "2px",
                                backgroundColor: "",
                                borderColor: ""
                              }}
                            >
                              Cancelar solicitação <i className="fa fa-users" />{" "}
                              -
                            </button>
                          ) : (
                            <button
                              onClick={() => this.solicitarAcesso(turma.id)}
                              className="btn btn-primary"
                              style={{
                                float: "right",
                                margin: "2px",
                                backgroundColor: "#2FB0C6",
                                borderColor: "#2FB0C6"
                              }}
                            >
                              Solicitar Acesso <i className="fa fa-users" /> +
                            </button>
                          )}
                        </CardFooter>
                      </Card>
                    </Col>
                  </Fragment>
                );
              })}
        </Row>
      </TemplateSistema>
    );
  }
}

{
  /* <CardFooter>

{solicitacoes
  .map(t => t.id)
  .includes(turma.id) ? (
  <button
    onClick={() => this.cancelarSolicitacao(turma.id)}
    className="btn btn-danger"
    style={{ float: "right" }}
  >
    Cancelar solicitação <i className="fa fa-users" />{" "}
    -
  </button>
) : (
  <button
    onClick={() => this.solicitarAcesso(turma.id)}
    className="btn btn-primary"
    style={{ float: "right" }}
  >
    Solicitar Acesso <i className="fa fa-users" /> +
  </button>
)}
</CardFooter> */
}
