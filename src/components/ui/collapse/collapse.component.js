import React from 'react'
import {useState} from 'react';
import {Button, Collapse} from 'react-bootstrap'

export default (props) =>{
    const lista = props.lista
    console.log(lista)
    const [open, setOpen] = useState(false);
    
    return (
        <div>            
            <div>
                <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
                    <tbody >
                        <tr>
                            <td style={{widthMax:"400px", width:"400px"}}>{lista.title}</td>
                            <td>{lista.code}</td>
                            <td>
                                <div className="btn-group  float-right" role="group" aria-label="Exemplo básico">
                                    <button className="btn-primary btn" onClick={() => props.onClick(lista)}>Adicionar</button>

                                    <button
                                    className ="btn btn-primary"
                                    onClick={() => setOpen(!open)}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={open}
                                    style={{position: "relative"}}
                                    ><i className="fe fe-chevron-down"/>
                                    </button>

                                </div>
                            </td>
                            
                        </tr>
                
                    </tbody>
                </table>       

            <div>
                <Collapse className="col-12" in={open}
                style={{backgroundColor:"white", marginTop:"0px"}}
                >
                <div id="example-collapse-text">
                <b>questoes: </b> <br/><br/>
               
                {lista.questions.map((questoes, index)=>(
                <div key={index}>
                <p>{index+1+" "+questoes.title}</p>
                </div>
                ))}
                </div>
                </Collapse>
            </div>
        </div>
    </div>
    );
  }