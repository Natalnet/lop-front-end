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
    lista: "",
    listas: []
  };

  async componentDidMount(){
    document.title="Relatorios"
    await this.getListas();
  }
  async getListas(){
    const request = await axios.get("http://localhost:3005/listas");
    if(request !== undefined){

    }
  }
  handleListaChange = e => {
    this.setState({ lista: e.target.value });
  };
  render() {
    const { listas } = this.state;
    return (
      <TemplateSistema>
        <div className="container-fluid form-control">
          <form className="row">
            <SelectOption
              classEstilo={"col-md-3"}
              defaultValue={"Selecione a lista..."}
              select={this.state.lista}
              handleChange={this.handleListaChange}
              arrayMap={listas}
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
          <Relatorio />
        </div>
      </TemplateSistema>
    );
  }
}
