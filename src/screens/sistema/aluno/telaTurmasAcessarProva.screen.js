import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import { generateHash } from "../../../util/auxiliaryFunctions.util";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import TurmaProvaScrren from "../../../components/screens/classTest.subscreen";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prova: "",
      loandingProva: false,
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getProva();
    const { turma, prova } = this.state;
    document.title = `${turma && turma.name} - ${prova && prova.title}`;
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
  async getProva() {
    const { id, idTest } = this.props.match.params;
    const idClass = id;
    let query = `?idClass=${idClass}`;
    try {
      this.setState({ loandingProva: true });
      const response = await api.get(`/test/${idTest}${query}`);
      const prova = response.data;
      const password = sessionStorage.getItem(
        `passwordTest-${prova && prova.id}`
      );
      const hashCode = `${generateHash(prova && prova.classHasTest.password)}-${
        prova && prova.id
      }`;
      // console.log('password: ',password)
      // console.log('hashCode: ',hashCode)

      if (
        (prova && prova.classHasTest.status === "FECHADA") ||
        !password ||
        password !== hashCode
      ) {
        this.props.history.push(`/aluno/turma/${id}/provas`);
      } else {
        this.setState({
          prova,
          loandingProva: false,
        });
      }
    } catch (err) {
      console.log(err);
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
                <Link to={`/aluno/turma/${this.props.match.params.id}/provas`}>
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
          <TurmaProvaScrren {...this.props} prova={prova} />
        )}
      </TemplateSistema>
    );
  }
}
