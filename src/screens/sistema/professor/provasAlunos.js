import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import api from "../../../services/api";
import ProvasAlunosScreen from "components/screens/provasAlunos.componente.screen";

export default class AlunosProvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      idTurma: this.props.match.params.id,
      loadingPresentes: false,
      presentes: [],
      contentInputSeach: "",
      radioAsc: false,
      radioDesc: true,
      valueRadioSort: "DESC",
      showFilter: false,
      fildFilter: "title",
      docsPerPage: 15,
      numPageAtual: sessionStorage.getItem("studentCorrectionPage") || 1,
      totalItens: 0,
      totalPages: 0,
      loadingInfoTurma: true,
      turma: "",
      idProva: this.props.match.params.idProva,
      numQuestions: 1,
    };
  }
  async componentDidMount() {
    document.title = "Provas dos alunos";
    await this.getAlunosPresentes();
    await this.getInfoTurma();
  }

  async getInfoTurma() {
    const { idTurma } = this.state;
    try {
      const response = await api.get(`/class/${idTurma}`);
      this.setState({
        turma: response.data,
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: true });
      console.log(err);
    }
  }

  async getAlunosPresentes(loading = true) {
    const { numPageAtual, docsPerPage } = this.state;
    const { idTurma } = this.state;
    let query = `?idClass=${idTurma}`;
    query += `&idTest=${this.props.match.params.idProva}`;
    query += `&docsPerPage=${docsPerPage}`;

    try {
      if (loading) this.setState({ loadingPresentes: true });
      const response = await api.get(
        `/feedBacksTest/page/${numPageAtual}${query}`
      );
      this.setState({
        presentes: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingPresentes: false,
        numQuestions: response.data.totalQuestions,
      });
      sessionStorage.setItem(
        "studentCorrectionPage",
        response.data.currentPage
      );
    } catch (err) {
      this.setState({ loadingPresentes: false });
      console.log(err);
    }
  }

  //async getAlunosPresentes() {
  //const { docsPerPage } = this.state;
  //const idTest = this.props.match.params.id;
  //let query = `?idTest=${idTest}`;
  //query += `&classes=yes`;
  //query += `&docsPerPage=${docsPerPage}`;
  //try {
  /*
      this.setState({loadingPresentes: true})
      const response = await api.get(``);
      console.log("presentes");
      console.log(response);
      this.setState({
        presentes: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingPresentes: false,
      });*/
  //} catch (err) {
  //this.setState({ loadingPresentes: false });
  //console.log(err);
  //}
  //}
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getAlunosPresentes()
    );
  }

  render() {
    const { loadingInfoTurma, turma } = this.state;
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
        <ProvasAlunosScreen
          {...this.props}
          {...this.state}
          handlePage={this.handlePage.bind(this)}
        />
      </TemplateSistema>
    );
  }
}
