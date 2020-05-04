import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import { Link } from "react-router-dom";
import Table from "components/ui/tables/tableType1.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import profileImg from "assets/perfil.png";
import api from "../../../services/api";

export default class AlunosProvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      idTurma: this.props.match.url.split("/").slice(3, 4),
      loadingPresentes: false,
      presentes: [
        {
          id: "7777",
          name: "fulano",
          email: "fulano@gmail.com",
          enrollment: "1234567",
          questoes: "10/10",
          notaSist: 9,
          notaProf: 9.5,
        },
        {
          id: "7777",
          name: "fulano",
          email: "fulano@gmail.com",
          enrollment: "1234567",
          questoes: "10/10",
          notaSist: 9,
          notaProf: 9.5,
        },
        {
          id: "7777",
          name: "fulano",
          email: "fulano@gmail.com",
          enrollment: "1234567",
          questoes: "10/10",
          notaSist: 9,
          notaProf: 9.5,
        },
        {
          id: "7777",
          name: "fulano",
          email: "fulano@gmail.com",
          enrollment: "1234567",
          questoes: "10/10",
          notaSist: 9,
          notaProf: 9.5,
        },
        {
          id: "7777",
          name: "fulano",
          email: "fulano@gmail.com",
          enrollment: "1234567",
          questoes: "10/10",
          notaSist: 9,
          notaProf: 9.5,
        },
      ],
      contentInputSeach: "",
      radioAsc: false,
      radioDesc: true,
      valueRadioSort: "DESC",
      showFilter: false,
      fildFilter: "title",
      docsPerPage: 25,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      loadingInfoTurma: true,
      turma: "",
    };
  }
  async componentDidMount() {
    document.title = "Provas dos alunos";
    await this.getAlunosPresentes();
    console.log(this.state.myClasses);
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
    console.log(this.state.turma);
  }

  async getAlunosPresentes() {
    //const { docsPerPage } = this.state;
    //const idTest = this.props.match.params.id;
    //let query = `?idTest=${idTest}`;
    //query += `&classes=yes`;
    //query += `&docsPerPage=${docsPerPage}`;
    try {
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
    } catch (err) {
      this.setState({ loadingPresentes: false });
      console.log(err);
    }
  }
  render() {
    const {
      loadingPresentes,
      presentes,
      idTurma,
      loadingInfoTurma,
      turma,
    } = this.state;
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
        <Row mb={15}>
          <Col xs={12}>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Matrícula</th>
                  <th>Questões</th>
                  <th>Nota Do sistema</th>
                  <th>Nota do Professor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingPresentes ? (
                  <tr>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                  </tr>
                ) : (
                  presentes.map((user, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <div
                          className="avatar d-block"
                          style={{
                            backgroundImage: `url(${
                              user.urlImage || profileImg
                            })`,
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.enrollment}</td>
                      <td>{user.questoes}</td>
                      <td>{user.notaSist}</td>
                      <td>{user.notaProf}</td>
                      <td>
                        <Link
                          to={`/professor/turma/${idTurma}/prova/${this.props.match.params.id}/aluno/${user.id}`}
                        >
                          <button className="btn btn-primary mr-2">
                            Corrigir
                            <i className={"fe fe-file-text"} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}
