/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

export default class CardBody extends Component {
    render() {
		let {loading,children,style} = this.props
		if(style){
			style.overflow = style.overflow?style.overflow:'auto'
		}else{
			style = {overflow:'auto'}
		}
	    

    return (
        <div className='card-body' style={style}>
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
