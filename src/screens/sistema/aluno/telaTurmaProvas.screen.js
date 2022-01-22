import React, { Component } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import api, { baseUrlBackend } from "../../../services/api";
import Swal from "sweetalert2";
import { generateHash } from "../../../util/auxiliaryFunctions.util";
import "katex/dist/katex.min.css";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import TurmaProvasScreen from "../../../components/screens/turmaProvas.componente.screen";

export default class Provas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provas: [],
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      loandingListas: false,
      password: "",
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getProvas();
    document.title = `${this.state.turma.name} - provas`;
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

  async getProvas() {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`;
    try {
      this.setState({ loandingListas: true });
      const response = await api.get(`/test${query}`);
      //console.log('provas: ',response.data);
      this.setState({
        provas: [...response.data],
        loandingListas: false,
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }
  
  async acessar(prova) {
    const url = `/aluno/turma/${this.props.match.params.id}/prova/${prova.id}`;
    try {
        const { value } = await Swal.fire({
          title: "Senha para acessar a prova",
          confirmButtonText: "Acessar",
          cancelButtonText: "Cancelar",
          input: "password",
          showCancelButton: true,
          inputValue: "", //valor inicial
          inputValidator: async (value) => {
            if (!value) {
              return "Você precisa escrever algo!";
            } 
            else{
              try{
                Swal.showLoading();
                console.log('chammoouuuu')
                await api.get('/test/check/password',{
                  params: {
                    idTest: prova.id,
                    password: value
                  }
                });
                console.log('deuuu certooo')
                Swal.hideLoading();
                sessionStorage.setItem(`passwordTest-${prova.id}`, `${value}`);
                this.props.history.push(url);
              }
              catch(err){
                console.log('deuuu erradooooo')
                Swal.hideLoading();
                return "Senha incorreta :(";
              }
            }
          },
        });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { loadingInfoTurma, turma, provas } = this.state;
    const { loandingListas } = this.state;
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" /> Provas
              </h5>
            )}
          </Col>
        </Row>
        {loandingListas ? (
          <Row mb={15}>
            <div className="loader" style={{ margin: "0px auto" }}></div>
          </Row>
        ) : (
          <TurmaProvasScreen
            {...this.state}
            {...this.props}
            provas={provas}
            acessar={this.acessar.bind(this)}
          />
        )}
      </TemplateSistema>
    );
  }
}
