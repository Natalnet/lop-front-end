import React from 'react'

// const button={
//     backgroundColor: '#1B60BE',
//     borderColor: '#1B60BE'
// };

export default (props)=>{
        const texto = props.children
        return(
            <button className='btn btn-primary'>
                {texto}
            </button>
        );
}