import React, { Component, Fragment } from "react";
import NavPagination from "components/ui/navs/navPagination";
import InputGroupo from "components/ui/inputGroup/inputGroupo.component";
import api from "../../../services/api";
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/Turmas/cardHead.component";
import CardOptions from "components/ui/card/Turmas/cardOptions.component";
import CardBody from "components/ui/card/Turmas/cardBody.component";
import CardFooter from "components/ui/card/Turmas/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default class HomeAlunoScreen extends Component {
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
    //this.handlePage=this.handlePage.bind(this)
  }

  async componentDidMount() {
    this.getProfessor();
    await this.getMinhasTurmas();

    document.title = "Inicio - Aluno";
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
      console.log(response.data.docs[0].classsesHasUseres[0].user_id);
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

  async getProfessor() {
    const id = "";
    const response = await api.get(
      "/user/1e265f2b-c536-47e2-8481-a96d8b03a510"
    );
    console.log("akii");
    console.log(response);
  }

  render() {
    const {
      fieldFilter,
      loadingTurmas,
      contentInputSeach,
      minhasTurmas,
      numPageAtual,
      totalPages
    } = this.state;
    return (
      <TemplateSistema active="home">
        <div style={{ marginBottom: "20px" }}>
          <Col xs={12}>
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
        </div>
        <Row>
          {loadingTurmas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            minhasTurmas.map((turma, index) => (
              <Fragment key={index}>
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
                    />
                  </Card>
                </Col>
              </Fragment>
            ))
          )}
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
