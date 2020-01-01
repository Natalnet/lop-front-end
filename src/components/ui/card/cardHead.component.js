/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */


import React, { Component } from "react";

export default class CardHead extends Component {
   
  render() {
    let {children,onClick,style} = this.props
    style = style || {}
    return (
      <div className="card-header" onClick={()=>onClick()} style={style}>
        {children}
      </div>
    );
  }
}
