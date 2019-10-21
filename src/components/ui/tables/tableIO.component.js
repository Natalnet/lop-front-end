import React,{Fragment} from 'react';
import HTMLFormat from '../htmlFormat'

export default props => {

	const {results} = props
	if(results.length>0){
	    return(
              <table className="table" wrap="off">
                <tbody>
                  <tr>
                    <td><b>N° teste</b></td>
                    <td><b>Entrada(s) para teste</b></td>
                    <td><b>Saída(s) do teste</b></td>            
                  </tr>
                  {results.map((teste,i)=>
                    <tr key={i}>
                      <td>{`${i+1}° Teste`} </td>
                      <td>
                        <HTMLFormat>
                          {teste.inputs}
                        </HTMLFormat>
                      </td>
                      <td>
                        <HTMLFormat>
                          {teste.output}
                        </HTMLFormat> 
                      </td>                    
                    </tr>
                    )}
                </tbody>
              </table>
	    )
	}
	else{
		return ''
	}
}