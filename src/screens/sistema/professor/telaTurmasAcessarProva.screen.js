import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import TurmaProvaScrren from "../../../components/screens/classTest.subscreen";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prova: "",
      loandingProva: true,
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      todasListas: [],
    };
  }

  async componentDidMount() {
    document.title = "Professor - provas";
    await this.getInfoTurma();
    await this.getProva();
    const { turma, prova } = this.state;
    document.title = `${turma && turma.name} - ${prova && prova.title}`;
  }
  async getInfoTurma() {
    const id = this.props.match.params.idClass;
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
  async getProva() {
    try {
      const { idClass, idTest } = this.props.match.params;
      let query = `?idClass=${idClass}`;
      this.setState({loandingProva: true});
      const response = await api.get(`/test/${idTest}${query}`);
      //console.log('prova: ',response.data)
      this.setState({
        prova: response.data,
        loandingProva: false,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async editTest() {
    //senha
    let { value: password } = await Swal.fire({
      title: `Informe uma senha de acesso à prova nessa turma`,
      confirmButtonText: "Ok",
      cancelButtonText: "Cancelar",
      input: "text",
      showCancelButton: true,
      inputValue: "", //valor inicial
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      inputValidator: (value) => {
        if (!value) {
          return "Você precisa fornecer uma senha";
        }
      },
    });
    if (!password) return null;

    //todos casos de teste
    const { value: showAllTestCases } = await Swal.fire({
      title: `
        Quando o aluno estiver resolvendo, deseja que apareça todos os casos de teste?`,
      //text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, Todos!",
      cancelButtonText: "Não, apenas o primeito!",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    //console.log({showAllTestCases})
    const { idClass, idTest } = this.props.match.params;
    const query = `?idClass=${idClass}`;
    const request = {
      idTest: idTest,
      password,
      showAllTestCases
    };
    try {
      Swal.fire({
        title: "Editando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      await api.put(`/classHasTest/${idTest}/update${query}`, request);
      this.getProva();
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova editada com Sucesso!",
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Prova não pôde ser editada",
      });
    }

  }

  async aplicarProva() {
    const idTest = this.props.match.params.idTest;
    const query = `?idClass=${this.props.match.params.idClass}`;
    const request = {
      status: "ABERTA",
    };
    try {
      Swal.fire({
        title: "Aplicando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/classHasTest/${idTest}/update/status${query}`, request);
      const { prova } = this.state;
      prova.classHasTest.status = "ABERTA";
      this.setState({ prova });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Prova aplicada com sucesso!",
      });
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel aplicar prova",
      });
    }
  }
  async recolherProva() {
    const idTest = this.props.match.params.idTest;
    const query = `?idClass=${this.props.match.params.idClass}`;
    const request = {
      status: "FECHADA",
    };
    try {
      Swal.fire({
        title: "Recolhendo provas",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/classHasTest/${idTest}/update/status${query}`, request);
      const { prova } = this.state;
      prova.classHasTest.status = "FECHADA";
      this.setState({ prova });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Provas recolhidas com sucesso!",
      });
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel recolher provas",
      });
    }
  }

  render() {
    const { loadingInfoTurma, turma, loandingProva, prova } = this.state;

    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
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
                    to={`/professor/turma/${this.props.match.params.idClass}/provas`}
                  >
                    Provas
                </Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  {prova ? (
                    prova.title
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

        {loandingProva ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
            <>
              <Row mb={15}>
                <Col xs={8}>
                  <div className="alert alert-info" role="alert">
                    <span className='mr-6'>
                      Senha: {prova && prova.classHasTest.password}
                    </span>
                    <span>
                      Mostrar todos os casos de teste: {prova && prova.classHasTest.showAllTestCases ?
                        "Sim, todos!" :
                        "Não, apenas o primeito!"
                      }
                    </span>
                  </div>


                </Col>
                <Col xs={4} textRight>
                  {prova && prova.classHasTest.status === "FECHADA" ? (
                    <button
                      className="btn btn-success mr-3"
                      onClick={() => this.aplicarProva()}
                    >
                      Aplicar prova
                    </button>
                  ) : (
                      <button
                        className="btn btn-danger mr-3"
                        onClick={() => this.recolherProva()}
                      >
                        Recolher prova
                      </button>

                    )}
                  <button
                    title="Editar senha"
                    onClick={() => this.editTest()}
                    className={`btn btn-info`}
                  >
                    <i className="fe fe-edit" />
                  </button>
                </Col>
              </Row>
              <TurmaProvaScrren {...this.props} prova={prova} />
            </>
          )}
      </TemplateSistema>
    );
  }
}
