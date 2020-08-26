import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import { range } from "../../../util/auxiliaryFunctions.util";
import Swal from "sweetalert2";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";

import { Pagination } from "components/ui/navs";

import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import api, { baseUrlBackend } from "../../../services/api";
import socket from "socket.io-client";
import Switch from "../../../components/ui/switch/switch.component";

import SupportedLanguages from "config/SupportedLanguages"
//import Shimmer from "react-shimmer-effect";

/*const botaoV = {
  float: "right"
};*/

const botao = {
  width: "100%",
};

export default class TurmasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minhasTurmas: [],
      loadingTurmas: false,
      contentInputSeach: "",
      fieldFilter: "name",
      docsPerPage: 10,
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      descriptions: [],
      status: "",
    };
    this.handlePage = this.handlePage.bind(this);
  }

  async componentDidMount() {
    document.title = "Início - professor";
    await this.getMinhasTurmas();
    this.getMinhasTurmasRealTime();
  }

  componentWillUnmount() {
    this.io && this.io.close();
  }

  async getMinhasTurmas(loadingResponse = true) {
    const {
      numPageAtual,
      contentInputSeach,
      fieldFilter,
      docsPerPage,
    } = this.state;
    let query = `?include=${contentInputSeach}`;
    query += `&field=${fieldFilter}`;
    query += `&docsPerPage=${docsPerPage}`;
    query += `&myClasses=yes`;
    try {
      if (loadingResponse) this.setState({ loadingTurmas: true });
      const response = await api.get(`/class/page/${numPageAtual}${query}`);
      this.setState({
        minhasTurmas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingTurmas: false,
      });
      let myClasses = sessionStorage.getItem("myClasses");
      if (myClasses && typeof JSON.parse(myClasses) === "object") {
        myClasses = JSON.parse(myClasses);
        let newClasses = response.data.docs;
        newClasses.forEach((c) => {
          if (!myClasses.map((t) => t.id).includes(c.id)) {
            myClasses = [
              ...myClasses,
              {
                id: c.id,
                year: c.year,
                name: c.name,
                semester: c.semester,
                languages: c.languages,
              },
            ];
          }
        });
        sessionStorage.setItem("myClasses", JSON.stringify(myClasses));
      } else {
        sessionStorage.setItem(
          "myClasses",
          JSON.stringify(
            response.data.docs.map((t) => {
              return {
                id: t.id,
                year: t.year,
                name: t.name,
                semester: t.semester,
                languages: t.languages,
              };
            })
          )
        );
      }
    } catch (err) {
      this.setState({ loadingTurmas: false });
      console.log(err);
    }
  }
  getMinhasTurmasRealTime() {
    this.io = socket(baseUrlBackend);
    for (let turma of this.state.minhasTurmas) {
      this.io.emit("connectRoonClass", turma.id); //conectando à todas salas (minhas Turmas)
    }
    this.io.on("RequestsClass", async (response) => {
      this.getMinhasTurmas(false);
    });
  }
  async handleState(state, idClass) {
    const request = {
      updatedClass: {
        state,
      },
    };
    try {
      Swal.fire({
        title: "Atualizando estado a turma",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/class/${idClass}/update`, request);
      Swal.fire({
        type: "success",
        title: "Estado da turma atualizado com sucesso!",
      });
      console.log("ok");
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel atualizar estado da turma",
      });
    }
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getMinhasTurmas()
    );
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
  // func(statu) {
  //   console.log(statu);
  //   if (statu === "ATIVA") {
  //     statu = "INATIVA";
  //     console.log(statu);
  //   } else {
  //     statu = "ATIVA";
  //     console.log(statu);
  //   }
  // }
  // funcaoStatus(status) {
  //   let statu = "ATIVA";
  //   if (statu === "ATIVA") {
  //     return (
  //       <label className="custom-switch" style={{ margin: "10px" }}>
  //         <input
  //           type="checkbox"
  //           name="custom-switch-checkbox"
  //           className="custom-switch-input"
  //           onChange={this.func(statu)}
  //         />
  //         <span className="custom-switch-indicator"></span>
  //         <span className="custom-switch-description">{status}</span>
  //       </label>
  //     );
  //   } else {
  //     return (
  //       <label className="custom-switch" style={{ margin: "10px" }}>
  //         <input
  //           type="checkbox"
  //           name="custom-switch-checkbox"
  //           className="custom-switch-input"
  //           onChange={this.func(statu)}
  //         />
  //         <span className="custom-switch-indicator"></span>
  //         <span className="custom-switch-description">{status}</span>
  //       </label>
  //     );
  //   }
  // }

  render() {
    const {
      fieldFilter,
      loadingTurmas,
      contentInputSeach,
      minhasTurmas,
      numPageAtual,
      totalPages,
      //descriptions
    } = this.state;

    return (
      <TemplateSistema active="home">
        <Row mb={24}>
          <Col xs={3}>
            <Link to={"/professor/novasturmas"}>
              <button className="btn btn-primary" type="button" style={botao}>
                Nova Turma <i className="fa fa-users" />{" "}
                <i className="fa fa-plus-circle" />
              </button>
            </Link>
          </Col>

          <Col xs={9}>
            <InputGroupo
              placeholder={`Perquise pelo ${
                fieldFilter === "nome"
                  ? "Nome"
                  : fieldFilter === "code"
                  ? "Código"
                  : "..."
              }`}
              value={contentInputSeach}
              handleContentInputSeach={this.handleContentInputSeach.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[
                { value: "name", content: "Nome" },
                { value: "code", content: "Código" },
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loadingTurmas}
            />
          </Col>
        </Row>
        <Row mb={24}>
          {loadingTurmas
            ? range(8).map((i) => (
                <Fragment key={i}>
                  <Col xs={12} md={6}>
                    <Card style={{ height: "178px" }}>
                      <div
                        className="loader"
                        style={{ margin: "0px auto", paddingTop: "170px" }}
                      />
                    </Card>
                  </Col>
                </Fragment>
              ))
            : minhasTurmas.map((turma) => (
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
                            return (
                              <img
                                className="ml-2"
                                width="25px"
                                key={language}
                                src={SupportedLanguages[language].icon}
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
                        <div className="d-inline-flex">
                          <Switch
                            status={turma.state}
                            id={turma.id}
                            style={{ margin: "auto 8px auto 0px" }}
                            onChange={this.handleState.bind(this)}
                          />
                          <p style={{ margin: "8px 8px" }}>{turma.state}</p>
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
                        </div>
                        <Link to={`/professor/turma/${turma.id}/editar`}>
                          <button
                            style={{
                              float: "right",
                              margin: "2px",
                              backgroundColor: "white",
                              color: "807D85",
                              border: "solid 1px",
                              borderColor: "#DFDFDF",
                            }}
                            className="btn  mr-2"
                          >
                            <i className="fa fa-edit" /> Editar
                          </button>
                        </Link>
                        <Link to={`/professor/turma/${turma.id}/participantes`}>
                          <button
                            style={{ float: "right", margin: "2px" }}
                            className="btn btn-primary mr-2"
                          >
                            <i className="fe fe-corner-down-right" /> Entrar
                          </button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </Col>
                </Fragment>
              ))}
        </Row>
        <Row>
          <Col xs={12} textCenter>
            <Pagination 
              count={totalPages} 
              page={Number(numPageAtual)} 
              onChange={this.handlePage} 
              color="primary" 
              size="large"
              disabled={loadingTurmas}
            />
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}
