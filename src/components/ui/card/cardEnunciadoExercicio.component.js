import React,{Fragment,Component} from 'react';

export default (props) => {
	console.log('props tableExemplos:');
	console.log(props);
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
                  <div className="form-group col-md-9 text-right">
                    <a href={`/sistema/professor/exercicio/${id}/atualizar`}>Editar questão</a>
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
                            {res.inputs.split('').map((v,i) => {
                              if(v ==='\n') return <Fragment key={i}><br/></Fragment>
                              else if(v ===' ') return <Fragment key={i}>&nbsp;</Fragment>
                              else return <Fragment key={i}>{v}</Fragment>
                            })}
                          </td>
                          <td>
                            {res.output.split('').map((v,i) => {
                              if(v ==='\n') return <Fragment key={i}><br/></Fragment>
                              else if(v ===' ') return <Fragment key={i}>&nbsp;</Fragment>
                              else return <Fragment key={i}>{v}</Fragment>
                            })}
                          </td>
                        </tr>
                      ).filter((res,i) => i<3)}
                    </tbody>
                  </table>
              </div>
            </div>
	  )
}