import React,{Fragment} from 'react'


export default props => {
	let children = props.children || ''
	children = children.toString().split('')

	return(
		<Fragment>
			{
	            children.length > 0 && children.map((char,i) => {
	                if(char ==='\n') {
	                	return (<Fragment key={i}><br/></Fragment>)
	                }
	                else if(char ===' '){
	                	return (<Fragment key={i}>&nbsp;</Fragment>)
	                }

	                else{
	                	return (<Fragment key={i}>{char}</Fragment>)
	                }
	            })
	        }
		</Fragment>
	)
}