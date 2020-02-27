              
import React, { Component } from "react";

export default class CardFooter extends Component {
  render() {
  	const {loading,children} = this.props
    return (
      <div className='card-footer'>
      	{loading
      	?
      		<div className="loader" style={{margin:'0px auto'}}></div>
      	:
      		children
      	}
       
      </div>
    )
  }
}

