import React, { Component } from "react";

export default class List extends Component {
  render() {
    return (
      <div className="container">
        <div className="input-group">
          <input
            className="form-control py-2 mt-2 mb-2"
            type="search"
            placeholder="UFRN"
            onChange={this.props.change}
          />
          <span className="input-group-append mt-2 mb-2">
            <button className="btn btn-outline-secondary" type="button">
              <i className="fa fa-search" />
            </button>
          </span>
        </div>
        <div className="list-unstyled border rounded">
          {this.props.items.map((item, index) => (
            <li
              className="list-group-item d-flex py-0 px-2 justify-content-between align-items-center border-bottom"
              key={index}
            >
              {item}
              <button
                type="button"
                className="btn border-0 rounded fa fa-wrench btn-outline-secondary"
                onClick={this.props.edit}
              />
            </li>
          ))}
        </div>
      </div>
    );
  }
}
