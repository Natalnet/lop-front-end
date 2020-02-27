import React from 'react'

const style = {
    backgroundColor: '#9CD2F9',
    height: '140px',
    marginTop: '-23px',
    marginBottom: '10px',
    marginLeft: '-0px',
    marginRight: '-0px',
    justifyContent: 'center', 
    alignItems: 'center',
    fontSize: '20px',
    opacity: '0.5'
}

export default props =>{
    const texto = props.children
    return(
        <div className='container d-flex justify-content-center' style={style}>
            {texto}
        </div>
    );
}