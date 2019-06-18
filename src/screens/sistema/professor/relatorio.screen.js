import React, { Component } from "react";

import axios from "axios";
import Relatorio from "../../../components/ui/relatorio.component";
import TemplateSistema from "components/templates/sistema.template";
import Button from "components/ui/button.component";
import SelectOption from "components/ui/selectOption.component";

var buttonH = "2.5rem";
var buttonW = "7rem";
export default class RelatorioScreen extends Component {
  state = {
    turma: "",
    turmas: []
  };

  async componentDidMount() {
    document.title = "Relatorios";
    await this.getTurmas();
  }
  async getTurmas() {
    const { data } = await axios.get("http://localhost:3005/turmas");
    if (data !== undefined) {
      data.map(tms => {
        return this.setState({ turmas: [...this.state.turmas,tms] });
      });
    }
  }
  handleTurmasChange = e => {
    this.setState({ turma: e.target.value });
  };
  render() {
    const { turmas } = this.state;
    return (
      <TemplateSistema>
        <div className="container-fluid form-control">
          <form className="row">
            <SelectOption
              classEstilo={"col-md-3"}
              defaultValue={"Selecione a turma..."}
              select={this.state.turma}
              handleChange={this.handleTurmasChange}
              arrayMap={turmas}
            />
            <Button
              defaultValue={"Add"}
              classEstilo={"btn btn-primary btn-sm"}
              estilo={{
                marginBottom: 5,
                height: buttonH,
                width: buttonW
              }}
            />
            <Button
              defaultValue={"Consultar"}
              classEstilo={"btn btn-primary btn-sm"}
              estilo={{
                marginBottom: 5,
                height: buttonH,
                width: buttonW
              }}
            />
            <Button
              defaultValue={"Limpar"}
              classEstilo={"btn btn-primary btn-sm"}
              estilo={{
                marginBottom: 5,
                height: buttonH,
                width: buttonW
              }}
            />
          </form>
          <br />
          <Relatorio turma={this.state.turma}/>
        </div>
      </TemplateSistema>
    );
  }
}
