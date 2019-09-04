import React from 'react'

export default (props) =>{
	const {title,description,inputs,outputs} = props
	const {handleTitleChange,handleDescriptionChange,handleInputsChange} = props
	return(
          <div className="form-row">
            <div className="form-group col-md-12">
              <label>Título: </label>
              <input onChange={props.handleTitleChange} className="form-control" placeholder="Digite o título da questão..." value={title}/>
            </div>
            <div className="form-group col-md-12">
              <label>Enunciado:  </label>
              <textarea onChange={props.handleDescriptionChange} style={{height:'150px'}} className="form-control" value={description}></textarea> 
            </div>
            <div className="form-group col-md-12">
              <label>Entradas para testes: </label>
              <textarea onChange={props.handleInputsChange} style={{height:'150px'}} className="form-control" wrap="off" value={inputs}></textarea> 
            </div>
            <div className="form-group col-md-12">
              <label>Saídas para testes: </label>
              <textarea onChange={props.handleOutputsChange} style={{height:'150px'}} className="form-control" wrap="off" value={outputs}></textarea> 
            </div>
         
          </div>

	)
}