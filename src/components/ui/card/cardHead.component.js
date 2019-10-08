/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */


import React, { Component } from "react";
import CardTitle from './cardTitle.component'
import CardOptions from './cardOptions.component'

export default class CardHead extends Component {
  render() {
  	const {children,center} = this.props
  	const posicao = center?'auto':''
    return (
      <div className="card-header">
        {children}
      </div>
    );
  }
}
