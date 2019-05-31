import React, { Component } from "react";
/*<SelectOption
  estilo={"col-md-2"}
  select={this.state.turma}
  handleChange={this.handleTurmaChange}
  defaultValue={"Seleciona a turma..."}
  arrayMap={turmas}
/>;*/
export default class SelectOption extends Component {
  render() {
    return (
        <div className={this.props.classEstilo}>
          <select
            className="custom-select"
            id=""
            style={{ marginTop: 20 }}
            value={this.props.select}
            onChange={this.props.handleChange}
          >
            <option defaultValue>{this.props.defaultValue}</option>
            {this.props.arrayMap.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
    );
  }
}
