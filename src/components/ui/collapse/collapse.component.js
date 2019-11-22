import React from 'react'

export default (props) =>{
    const {children,id} = props
    return (
        <div className="collapse" id={id}>
            {children}
        </div>
    )
}