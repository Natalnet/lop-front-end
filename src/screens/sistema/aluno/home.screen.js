import React, { Component, Fragment } from "react";
import api from "../../../services/api";
import { range } from "../../../util/auxiliaryFunctions.util";
import { Link } from "react-router-dom";

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import IconCPP from "../../../assets/icons/icons-cpp.svg";
import IconJS from "../../../assets/icons/icons-javascript.svg";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import CardLoader from "components/ui/card/cardLoader.component";
import profileImg from "../../../assets/perfil.png";

export default class HomeAlunoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minhasTurmas: [],
      loadingTurmas: false,
      descriptions: [],
    };
  }

  async componentDidMount() {
    await this.getMinhasTurmas();
    document.title = "Inicio - Aluno";
  }
  async getMinhasTurmas() {
    let query = `?myClasses=yes`;
    try {
      this.setState({ loadingTurmas: true });
      const response = await api.get(`/class${query}`);
      this.setState({
        minhasTurmas: [...response.data],
        loadingTurmas: false,
      });
      const myClasses = response.data.map((t) => {
        return {
          id: t.id,
          year: t.year,
          name: t.name,
          semester: t.semester,
          languages: t.languages,
        };
      });
      sessionStorage.setItem("myClasses", JSON.stringify(myClasses));
    } catch (err) {
      this.setState({ loadingTurmas: false });
      console.log(err);
    }
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        ...this.state,
        contentInputSeach: e.target.value,
      } /*,()=>this.getMinhasTurmas()*/
    );
  }
  filterSeash(e) {
    this.getMinhasTurmas();
  }
  handleSelectFieldFilter(e) {
    this.setState(
      {
        fieldFilter: e.target.value,
      } /*,()=>this.getMinhasTurmas()*/
    );
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getMinhasTurmas()
    );
  }

  render() {
    const { loadingTurmas, minhasTurmas } = this.state;

    return (
      <TemplateSistema active="home">
        <Row>
          {loadingTurmas ? (
            range(8).map((i) => (
              <Fragment key={i}>
                <Col xs={12} md={6}>
                  <CardLoader style={{ height: "178px" }}>
                    <div
                      style={{ margin: "0px auto", paddingTop: "170px" }}
                    ></div>
                  </CardLoader>
                </Col>
              </Fragment>
            ))
          ) : minhasTurmas.length === 0 ? (
            <Col xs={12} textCenter>
              <div className="alert alert-info" role="alert">
                Você ainda não está em nenhuma turma{" "}
                <i className="fa fa-frown-o" />. Caso tenha o código de uma,
                poderá solicitar acesso a ela em
                <Link to="/aluno/turmasAbertas">
                  <i className="fe fe-users ml-2" /> Turmas abertas
                </Link>
              </div>
            </Col>
          ) : (
            minhasTurmas.map((turma) => (
              <Fragment key={turma.id}>
                <Col xs={12} lg={6}>
                  <Card>
                    <CardHead
                      style={{
                        backgroundColor: "rgba(190,190,190,0.2)",
                        maxHeight: "56px",
                      }}
                    >
                      <CardTitle>
                        <i className="fa fa-users" /> {turma.name} -{" "}
                        {turma.year}.{turma.semester}
                      </CardTitle>
                      <CardOptions>
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            margin: "0px",
                          }}
                        >
                          Código: {turma.code}
                        </p>
                      </CardOptions>
                    </CardHead>
                    <CardBody className="card-class overflow-auto">
                      <p>
                        <b>Linguagens: </b>
                        {turma.languages.map((language) => {
                          const src = {
                            cpp: IconCPP,
                            javascript: IconJS,
                          };
                          return (
                            <img
                              className="ml-2"
                              width="25px"
                              key={language}
                              src={src[language]}
                              alt={language}
                            />
                          );
                        })}
                      </p>
                      <p>
                        <b>Descrição da turma:</b> &nbsp; {turma.description}
                      </p>
                    </CardBody>
                    <CardFooter>
                      <div
                        className="avatar d-block"
                        style={{
                          float: "left",
                          margin: "5px 5px 5px 0px",
                          backgroundImage: `url(${
                            turma.author.urlImage || profileImg
                          })`,
                        }}
                      />
                      <div
                        style={{
                          margin: "4px",
                          alignItems: "center",
                          textAlign: "left",
                          float: "left",
                          fontSize: "10px",
                        }}
                      >
                        {turma.author.name}
                        <div className="row" />
                        {turma.author.email}
                      </div>
                      <Link to={`/aluno/turma/${turma.id}/dashboard`}>
                        <button
                          style={{
                            float: "right",
                            backgroundColor: "#2FB0C6",
                            borderColor: "#2FB0C6",
                          }}
                          className="btn btn-primary mr-2"
                        >
                          <i className="fe fe-corner-down-right" /> Entrar
                        </button>
                      </Link>
                      <ul className="social-links list-inline mb-0 mt-2">
                        <li
                          className="list-inline-item  ml-4"
                          title={`${turma.usersCount} participante(s)`}
                        >
                          <i className="fa fa-users mr-1" />
                          {turma.usersCount}
                        </li>
                        <li
                          className="list-inline-item"
                          title={`${turma.listsCount} lista(s)`}
                        >
                          <i className="fe fe-file-text mr-1" />
                          {turma.listsCount}
                        </li>
                        <li
                          className="list-inline-item"
                          title={`${turma.testsCount} prova(s)`}
                        >
                          <i className="fa fa-file-text-o mr-1" />
                          {turma.testsCount}
                        </li>
                      </ul>
                    </CardFooter>
                  </Card>
                </Col>
              </Fragment>
            ))
          )}
        </Row>
      </TemplateSistema>
    );
  }
}
