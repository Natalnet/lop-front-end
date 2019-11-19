import React,{Fragment} from 'react';
import HTMLFormat from '../htmlFormat'
import Card from '../card/card.component'
import CardHead from '../card/cardHead.component'
import CardTitle from '../card/cardTitle.component'
import CardOptions from '../card/cardOptions.component'
import CardBody from '../card/cardBody.component'


export default props => {

	const {response,erro,descriptionErro} = props
      if(erro){
        return(
          <Card>
            <CardBody>
              <HTMLFormat>
                {descriptionErro}
              </HTMLFormat>
            </CardBody>
          </Card>
        )
      }
	    return(
        <Fragment>
        {response.map((teste,i)=>
          <Card key={i}>
            <CardHead>
              <CardTitle>
                {`${i+1}° Teste `}
                {teste.isMatch?
                  <i className="fa fa-smile-o" style={{color:'green'}}/>
                :
                  <i className="fa fa-frown-o" style={{color:'red'}}/>
                }
              </CardTitle>
              <CardOptions>

                <i
                  title='Ver descrição'
                  style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                  className={`fe fe-chevron-down`} 
                  data-toggle="collapse" data-target={'#collapse'+i} 
                  aria-expanded={false}
                />
              </CardOptions>
            </CardHead>
            <div className="collapse" id={'collapse'+i}>
              <CardBody>
                <table className="table" wrap="off">
                  <tbody>
                    <tr>
                      <td><b>Entrada(s) para teste</b></td>
                      <td><b>Saída do seu programa</b></td>
                      <td><b>Saída esperada</b></td>
                    </tr>
                    <tr>
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
                  </tbody>
                </table>
              </CardBody>
            </div>
          </Card>
        )}
      </Fragment>
	   )
}