/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

export default class CardTitle extends Component {
  render() {
  	const {children,center} = this.props
  	const posicao = center?'auto':''
    return (
        <h3 className="card-title" style={{margin:posicao}}>{children}</h3>
    );
  }
}
