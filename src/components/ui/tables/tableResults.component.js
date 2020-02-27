import React,{Fragment} from 'react';
import HTMLFormat from '../htmlFormat'

export default props => {

	const {percentualAcerto,response} = props
	if(response.length>0){
	    return(
              <table className="table" wrap="off">
                <tbody>
                  <tr>
                    <td>Percentual de acerto: {percentualAcerto + ' %'}</td>
                  </tr>
                  <tr>
                    <td><b>N° teste</b></td>
                    <td><b>Resposta</b></td>
                    <td><b>Entrada(s) para teste</b></td>
                    <td><b>Saída do seu programa</b></td>
                    <td><b>Saída esperada</b></td>            
                  </tr>
                  {response.map((teste,i)=>
                    <tr key={i}>
                      <td>{`${i+1}° Teste`} </td>
                      <td>{teste.isMatch?<span style={{color:'green'}}>Correta</span>:<span style={{color:'red'}}>Errado</span>}</td>
                      <td>
                        <HTMLFormat>
                          {teste.inputs}
                        </HTMLFormat>
                      </td>
                      <td>  
                        <HTMLFormat>
                          {teste.saidaResposta}
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