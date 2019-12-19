import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/TurmasProfessor/cardHead.component";
import CardOptions from "components/ui/card/TurmasProfessor/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/TurmasProfessor/cardBody.component";
import CardFooter from "components/ui/card/TurmasProfessor/cardFooter.component";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import api, { baseUrlBackend } from "../../../services/api";
import socket from "socket.io-client";

const botaoV = {
  float: "right"
};

const botao = {
  width: "100%"
};

export default class TurmasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minhasTurmas: [],
      loadingTurmas: false,
      contentInputSeach: "",
      fieldFilter: "name",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      descriptions: []
    };
    this.handlePage = this.handlePage.bind(this);
  }

  async componentDidMount() {
    document.title = "Início - professor";
    await this.getMinhasTurmas();
    this.getMinhasTurmasRealTime();
  }

  async getMinhasTurmas(loadingResponse = true) {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach}`;
    query += `&field=${fieldFilter}`;

    try {
      if (loadingResponse) this.setState({ loadingTurmas: true });
      const response = await api.get(
        `/user/class/page/${numPageAtual}?${query}`
      );
      console.log("minhas turmas");
      console.log(response.data);
      //console.log(query);
      this.setState({
        minhasTurmas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingTurmas: false
      });
    } catch (err) {
      this.setState({ loadingTurmas: false });
      console.log(err);
    }
  }
  getMinhasTurmasRealTime() {
    const io = socket(baseUrlBackend);
    for (let turma of this.state.minhasTurmas) {
      io.emit("connectRoonClass", turma.id); //conectando à todas salas (minhas Turmas)
    }
    io.on("RequestsClass", async response => {
      console.log(response);
      this.getMinhasTurmas(false);
    });
  }
  async handleShowDescription(id) {
    console.log("descriptions");
    const { descriptions } = this.state;
    const index = descriptions.indexOf(id);
    if (index === -1) {
      await this.setState({ descriptions: [id, ...descriptions] });
    } else {
      await this.setState({
        descriptions: [...descriptions.filter((desc, i) => i !== index)]
      });
    }
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage
      },
      () => this.getMinhasTurmas()
    );
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  handleContentInputSeach(e) {
    console.log(e.target.value);
    this.setState(
      {
        ...this.state,
        contentInputSeach: e.target.value
      } /*,()=>this.getMinhasTurmas()*/
    );
  }
  filterSeash(e) {
    this.getMinhasTurmas();
  }
  handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState(
      {
        fieldFilter: e.target.value
      } /*,()=>this.getMinhasTurmas()*/
    );
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
      },
      () => this.getMinhasTurmas()
    );
  }

  render() {
    const {
      fieldFilter,
      loadingTurmas,
      contentInputSeach,
      minhasTurmas,
      numPageAtual,
      totalPages,
      descriptions
    } = this.state;
    const range = num => {
      let arr = [];
      for (let i = 0; i < num; i++) arr.push(i);
      return arr;
    };
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
                { value: "code", content: "Código" }
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loadingTurmas}
            />
          </Col>
        </Row>
        <Row mb={24}>
          {loadingTurmas
            ? range(8).map(i => (
                <Fragment key={i}>
                  <Col xs={12} md={6}>
                    <Card>
                      <CardHead></CardHead>
                      <CardBody loading></CardBody>
                    </Card>
                  </Col>
                </Fragment>
              ))
            : minhasTurmas.map((turma, index) => (
                <Fragment key={turma.id}>
                  <Col xs={12} md={6}>
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
                      <CardFooter
                        idTurma={turma.id}
                        participantes={turma.usersCount}
                        solicitacoes={turma.solicitationsCount}
                        status={turma.state}
                      />
                    </Card>
                  </Col>
                </Fragment>
              ))}
        </Row>
        <Row>
          <Col xs={12} textCenter>
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageAtual}
              handlePage={this.handlePage}
            />
          </Col>
        </Row>
      </TemplateSistema>
    );
  }
}

{
  /* <CardFooter>
<span
  title={`${turma.usersCount} participante(s)`}
  className="avatar avatar-cyan mr-1"
>
  {turma.usersCount}
</span>

<span
  title={`${turma.solicitationsCount} solicitação(ões)`}
  className="avatar avatar-red mr-1"
>
  {turma.solicitationsCount}
</span>

<Link to={`/professor/turma/${turma.id}/editar`}>
  <button style={botaoV} className="btn btn-success mr-2">
    <i className="fa fa-edit" /> Editar
  </button>
</Link>
<Link to={`/professor/turma/${turma.id}/participantes`}>
  <button style={botaoV} className="btn btn-primary mr-2">
    <i className="fe fe-corner-down-right" /> Entrar
  </button>
</Link>
</CardFooter> */
}
