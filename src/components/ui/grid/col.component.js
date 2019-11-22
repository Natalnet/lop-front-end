import React from 'react'

export default (props)=>{
	const {children,mb,mt, xs,xl,sm,md,lg,textCenter} = props
	const colStyle = {
		marginBottom : `${mb || 0}px`,
		marginTop:`${mt || 0}px`
	}
	let grid = xs?`col-${xs}`:''
	grid+=xl?` col-xl-${xl}`:''
	grid+=sm?` col-sm-${sm}`:''
	grid+=md?` col-md-${md}`:''
	grid+=lg?` col-lg-${lg}`:''
	grid+=textCenter?' text-center':''
	return(
		<div className={grid} style={colStyle}>
			{children}
		</div>
	)
}