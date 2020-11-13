import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import TurmaProvaScrren from "../../../components/screens/turmaProva.componente.screen";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prova: "",
      usuario: "",
      loandingProva: true,
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      todasprovas: [],
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
    try {
      const { id, idProva, idUser } = this.props.match.params;
      let query = `?idClass=${id}`;
      query += `&idUser=${idUser}`;
      const response = await api.get(`/test/${idProva}${query}`);
      this.setState({
        prova: response.data.test,
        usuario: response.data.user,
        loandingProva: false,
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
      usuario,
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
              <h5 style={{ margin: "0px", display: "inline" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" />
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/participantes`}
                >
                  Participantes
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/participantes/${this.props.match.params.idUser}/listas`}
                >
                  {usuario ? (
                    `${usuario.name} `
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
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
                {prova ? (
                  `${prova.title}`
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
          <TurmaProvaScrren
            {...this.props}
            prova={prova}
            user={usuario}
            participant
          />
        )}
      </TemplateSistema>
    );
  }
}
