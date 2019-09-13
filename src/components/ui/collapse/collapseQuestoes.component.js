import React,{useState} from 'react';
import {Button, Collapse} from 'react-bootstrap'

export default (props) =>{
    const questao = props.questoes
    console.log(questao.title)
    const chave = props.chave
    const [open, setOpen] = useState(false);
    return (
        <div>            
                <div>
                <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
                    <tbody >
                        <tr>
                            <td>{questao.title}</td>
                            <td>
                                <button
                                className ="btn btn-primary float-right"
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                style={{position: "relative"}}
                                >
                                ver
                                </button>
                            </td>
                            
                        </tr>
                   
                    </tbody>
                </table>       

                 <div>
                    <Collapse className="col-12" in={open}
                    style={{backgroundColor:"white", marginTop:"0px"}}
                    >
                    <div id="example-collapse-text">
                    <b>Descrição: </b>
                    <p>{questao.description}</p>
                    </div>
                    </Collapse>
                </div>
            </div>
        </div>
    );
  }