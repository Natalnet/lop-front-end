import React, { Component } from "react";

import { Link } from "react-router-dom";
export default class logoLOP extends Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Link to={this.props.to}>
          <img
            className="h-9"
            alt="Logo sistema"
            src="/assets/images/logo.png"
          />
        </Link>
      </div>
    );
  }
}
