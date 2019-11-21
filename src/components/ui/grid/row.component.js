import React from 'react'

export default (props)=>{
	const {children,mb} = props
	const rowStyle = {
		marginBottom : `${mb || 0}px`
	}
	return(
		<div className='row' style={rowStyle}>
			{children}
		</div>
	)
}