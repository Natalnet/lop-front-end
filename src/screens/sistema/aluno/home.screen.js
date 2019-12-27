import React, { Component, Fragment } from "react";
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
      descriptions: []
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
      console.log("minhas turmas", response.data);
      this.setState({
        minhasTurmas: [...response.data],
        loadingTurmas: false
      });
      const myClasses = response.data.map(t => {
        return {
          id: t.id,
          year: t.year,
          name: t.name,
          semester: t.semester
        };
      });
      sessionStorage.setItem("myClasses", JSON.stringify(myClasses));
    } catch (err) {
      this.setState({ loadingTurmas: false });
      console.log(err);
    }
  }

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
    const { loadingTurmas, minhasTurmas } = this.state;
    return (
      <TemplateSistema active="home">
        <Row>
          {loadingTurmas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            minhasTurmas.map(turma => (
              <Fragment key={turma.id}>
                <Col xs={12} lg={6}>
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
      </TemplateSistema>
    );
  }
}
