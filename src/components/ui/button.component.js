import React, { Component } from "react";

export default class Button extends Component {
  render() {
    return (
      <button
        type="submit"
        className={this.props.classEstilo}
        style={this.props.estilo}
        onClick={this.props.click}
      >
        {this.props.defaultValue}
      </button>
    );
  }
}
