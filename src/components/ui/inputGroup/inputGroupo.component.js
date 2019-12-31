import React from 'react'

export default props =>{
	const {placeholder,value,filterSeash,handleContentInputSeach,handleSelect,options,loading,clearContentInputSeach} = props
	return(
        <form onSubmit={(e)=> {
            e.preventDefault()
            return filterSeash(e)
        }}>
        <div className="input-group">
            <input 
                type="text" 
                className="form-control" 
                placeholder={placeholder}
                aria-label="Recipient's username" 
                aria-describedby="button-addon2"
                value={value}
                onChange={(e) => handleContentInputSeach(e)}
            />
             <div className="selectgroup" >
                <select style={{cursor:"pointer"}} onChange={(e)=>handleSelect(e)} className="selectize-input items has-options full has-items form-control">
                  {options.map((option,i)=>(
                  	<option key={i} value={option.value}>{option.content}</option>
                  ))}
                </select>     
            </div>
            <button 
                className={`btn btn-secondary btn-outline-secondary `}                            
                type="submit" 
                id="button-addon2"
            >
                <i className="fe fe-search" />
            </button>
            <button 
                className={`btn btn-secondary btn-outline-secondary ${loading && 'btn-loading'}`}                            
                type="button" 
                id="button-addon3"
                onClick={()=> clearContentInputSeach()}
            >
                <i className="fe fe-refresh-cw" />
            </button>
        </div>
        </form>
	)
}