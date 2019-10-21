import React,{Fragment,Component} from 'react';
import HTMLFormat from '../htmlFormat'


export default (props) => {
	const {title,description,id,results} = props
	  return(
            <div className="card">
              <div className="card-header">
                <h3>{title}</h3>
              </div>
              <div className="card-body">
                <p className="card-text">{description}</p>
              </div>
              <div className="card-footer">
                <div className="form-row">
                  <div className="form-group col-md-3">
                    <h4>Exemplos</h4>
                  </div>
                </div>
                  <table className="table">
                    <tbody>
                     <tr>
                       <td><b>Exemplo de entrada</b></td>
                       <td><b>Exemplo de saída</b></td>                       
                      </tr>
                       {results.map((res,i)=> 
                        <tr key={i}>
                          <td>
                            <HTMLFormat>
                              {res.inputs}
                            </HTMLFormat>
                          </td>
                          <td>
                            <HTMLFormat>
                              {res.output}
                            </HTMLFormat>
                          </td>
                        </tr>
                      ).filter((res,i) => i<3)}
                    </tbody>
                  </table>
              </div>
            </div>
	  )
}