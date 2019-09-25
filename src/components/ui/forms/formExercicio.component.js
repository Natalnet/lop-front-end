import React from 'react'
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default (props) =>{
	const {title,description,inputs,outputs,katexDescription,status,difficulty} = props
	const {handleTitleChange,handleDescriptionChange,handlekatexDescription,handleStatus,handleDifficulty,handleInputsChange} = props
	return(
          <div className="form-row">
            <div className="form-group col-md-6">
                <label for="selectStatus">Status da questão: </label>
                <select className="form-control" defaultValue={status} id='selectStatus' onChange={handleStatus}>
                  <option value = 'PÚBLICA' >Pública (para uso em listas)</option>
                  <option value = 'PRIVADA' >Oculta (para uso em provas)</option>
                </select>
            </div>
            <div className="form-group col-md-6">
                <label for="selectDifficulty">Dificudade </label>
                <select className="form-control" defaultValue={difficulty} id='selectDifficulty' onChange={handleDifficulty}>
                  <option value = 'Muito fácil' >Muito fácil</option>
                  <option value = 'Fácil' >Fácil</option>
                  <option value = 'Médio' >Médio</option>
                  <option value = 'Difícil' >Difícil</option>
                  <option value = 'Muito difícil' >Muito difícil</option>

                </select>
            </div>
            <div className="form-group col-md-12">
              <label>Título: </label>
              <input onChange={props.handleTitleChange} className="form-control" placeholder="Digite o título da questão..." value={title}/>
            </div>

            <div className="form-group col-md-12">
              <label>Enunciado:  </label>
              <textarea onChange={props.handleDescriptionChange} style={{height:'150px'}} className="form-control" value={description}></textarea> 
            </div>
            <div className="form-group col-md-6">
                <label>
                  Katex: &nbsp;  
                  <a href='https://katex.org/docs/supported.html#operators' className="badge badge-info" target='_blank'>
                    <i className="fa fa-info-circle"/> &nbsp;
                    Ver documentação
                  </a>
                </label>
                <textarea onChange={props.handlekatexDescription} style={{height:'150px'}} className="form-control" value={katexDescription}></textarea> 
            </div>
            <div className="col-md-6" >
                <label>Saída Katex:  </label>
                <div className="alert alert-info" role="alert" style={{height:'150px'}}>
                  <BlockMath>
                      {katexDescription}
                  </BlockMath>
                </div>
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