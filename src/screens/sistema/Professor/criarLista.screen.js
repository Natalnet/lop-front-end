import React, { Component } from "react";
import {Redirect} from 'react-router-dom'

import TemplateSistema from "components/templates/sistema.template";

export default class CriarListaScreen extends Component {
    state = {
        redirect: false,
        items: []
    };

    componentDidMount() {
        this.getExercicios();
    }

    getExercicios = () => {
        let dbfile = "http://localhost:3001/question";
        fetch(dbfile)
            .then(res => res.json())
            .then(data => {
                data.map(exercicios => {
                return this.setState({
                    items: [
                    ...this.state.items,
                    exercicios
                    ]
                });
                });
            })
            .catch(e => console.log(e));
            
    };

    render() {
        if(this.state.perfil!=="PROFESSOR"){
            return <Redirect to="/*" />;
        }
        return (
        <TemplateSistema>
            <div className="container-fluid">
                <form>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1>Criar Lista</h1><br></br>
                            </div>    
                            <br></br>

                            

                            <div className="row container">
                                <input 
                                    type="text" 
                                    className="form-control col-9" 
                                    placeholder="Titulo da lista"
                                />

                                <div className="col-3">
                                    <select 
                                        className="form-control" 
                                    >
                                        <option>selecione....</option>
                                        <option>EXERCICIO</option>
                                        <option>PROVA</option>
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            <h4>Selecione as questões:</h4>
                            <br></br>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Titulo</th>
                                        <th>Dificuldade</th>
                                        <th>nota</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.items.map((exercicios, index) => (
                                        <tr key={index}>
                                            <td>{exercicios.title}</td>
                                            <td>Médio</td>
                                            <td>8/10</td>
                                            <td><input type="checkbox"/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br>{console.log(this.state.items)}</br>
                        </div>
                    </div>
                </form>
            </div>
        </TemplateSistema>
        )
    }
}