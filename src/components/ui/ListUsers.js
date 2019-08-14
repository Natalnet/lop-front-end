import React, { Component } from "react";

export default class ListUsers extends Component {
  render() {
    return (
      <div>
        <select
          className="custom-select py-0 w-auto form-control-sm"
          value={this.props.funcao}
          onChange={this.props.changeOption}
        >
          <option defaultValue>{this.props.def1}</option>
          <option>{this.props.def2}</option>
          <option>{this.props.def3}</option>
        </select>
      </div>
    );
  }
}
