import React, { Component } from "react";

import axios from "axios";
import Relatorio from "../../../components/ui/relatorio.component";
import TemplateSistema from "components/templates/sistema.template";

export default class RelatorioScreen extends Component {
  state = {
    turma: "",
    turmas: []
  };

  componentDidMount() {
    document.title = "Sistema Professor - Plataforma LOP";
    this.getTurmas();
  }
  handleTurmaChange = e => {
    this.setState({ turma: e.target.value });
  };
  getTurmas = async () => {
    const { data } = await axios.get("http://localhost:3005/turmas");

    return this.setState({
      turmas: [...data]
    });
  };
  render() {
    const { turmas } = this.state;
    return (
      <TemplateSistema>
        <div className="container-fluid form-control">
          <form className="row">
            <div className="col-md-6">
              <select
                className="custom-select"
                id=""
                style={{ marginTop: 20 }}
                value={this.state.turma}
                onChange={this.handleTurmaChange}
              >
                <option defaultValue>Selecione a turma...</option>
                {turmas.map((turma, index) => (
                  <option key={index} value={turma}>
                    {turma}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <br />
          <Relatorio turma={this.state.turma} />
        </div>
      </TemplateSistema>
    );
  }
}
