import React from 'react'

export default (props)=>{
	let {children,mt,mr,mb,ml,pt,pr,pb,pl,xs,xl,sm,md,lg,textCenter} = props
	pl = typeof pl ==="number"?pl:12
	pr = typeof pr ==="number"?pr:12
	const colStyle = {
		margin:`${mt || 0}px ${mr || 0}px ${mb || 0}px ${ml || 0}px`,
		padding:`${pt || 0}px ${pr}px ${pb || 0}px ${pl}px`
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