/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

export default class CardBody extends Component {
  render() {
    return (
      <div className='card-body'>
        {this.props.children}
      </div>
    );
  }
}
