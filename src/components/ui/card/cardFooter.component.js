              
import React, { Component } from "react";

export default class CardFooter extends Component {
  render() {
    return (
      <div className="card-footer">
        {this.props.children}
      </div>
    );
  }
}

