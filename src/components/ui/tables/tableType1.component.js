import React from 'react'

const table={
    backgroundColor:"white", 
    border:'1px solid #D5E1F2', 
    borderRadius:'2px'
}

export default (props) =>{
    const content = props.children
    return(
        <table className='table table-hover' style={table}>
            {content}
        </table>
    );
}