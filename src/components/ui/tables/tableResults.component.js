import React,{Fragment} from 'react';

export default (props) => {
	console.log('props tableResults:');
	console.log(props);
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
                        {teste.inputs.split('').map((v,i) => {
                          if(v ==='\n') return <Fragment key={i}><br/></Fragment>
                          else if(v ===' ') return <Fragment key={i}>&nbsp;</Fragment>
                          else return <Fragment key={i}>{v}</Fragment>
                        })}
                      </td>
                      <td>            
                        {teste.saidaResposta.split('').map((v,i) => {
                          if(v ==='\n') return <Fragment key={i}><br/></Fragment>
                          else if(v ===' ') return <Fragment key={i}>&nbsp;</Fragment>
                          else return <Fragment key={i}>{v}</Fragment>
                        })}
                      </td>
                      <td>
                        {teste.output.split('').map((v,i) => {
                          if(v ==='\n') return <Fragment key={i}><br/></Fragment>
                          else if(v ===' ') return <Fragment key={i}>&nbsp;</Fragment>
                          else return <Fragment key={i}>{v}</Fragment>
                        })}
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