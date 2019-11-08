/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React,{forwardRef} from "react";

const Card = (props,ref)=>{
  	const {loading,children,style} = props
    return (
    	<div className='row row-cards row-deck turma' ref={ref}>
    		<div className="col-12">
    			<div className="card" style={style || {} } >
			      {children}
		      </div>
      	</div>
      </div>
    );
}
export default forwardRef(Card)

