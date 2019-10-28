import React,{Fragment,Component} from 'react';
import HTMLFormat from '../htmlFormat'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";

export default (props) => {
	const {title,description,id,results} = props
	  return(
            <Card>
              <CardHead>
                <CardTitle>
                  {title}
                </CardTitle>
              </CardHead>
              <CardBody>
                <p className="card-text">{description}</p>
              </CardBody>
              <CardFooter>
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
              </CardFooter>
            </Card>
	  )
}