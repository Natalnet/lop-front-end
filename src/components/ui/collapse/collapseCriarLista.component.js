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
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Dificuldade</th>
                            <th>nota</th>
                            <th></th>
                        </tr>
                    </thead>
                    {questao.map((questao, index) => (
                    <tbody >
                        <tr>
                            <td>{questao.title}</td>
                            <td>Médio</td>
                            <td>8/10</td>
                            <td><input type="checkbox"/></td>
                            <td><a
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                style={{position: "relative"}}>
                                    <i className="fa fa-chevron-down"/>
                                </a>
                            </td>
                        </tr>
                        <div>
                            <Collapse className="" in={open}
                            style={{backgroundColor:"white", marginTop:"0px"}}
                            >
                            <div id="example-collapse-text">
                            <b>Descrição: </b>
                            <p>{questao.description}</p>
                            </div>
                            </Collapse>
                        </div>
                    </tbody>
                    ))}
                </table>       

                
            </div>
        </div>
    );
  }