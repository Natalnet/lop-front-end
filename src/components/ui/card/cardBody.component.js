/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

export default class CardBody extends Component {
  render() {
  	const {loading,children} = this.props
    return (
      <div className='card-body'>
      	{loading
      	?
      		<div className="loader"  style={{margin:'0px auto'}}></div>
      	:
      		children
      	}
       
      </div>
    );
  }
}
