import React, { Component } from "react";
import { Link } from "react-router-dom";

import TemplateSistema from "components/templates/sistema.template";

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class HomeExerciciosScreen extends Component {
    state = {
        redirect: false,
        items: []
    }

    componentDidMount() {
        this.getTurmas();
    }

    getTurmas = () => {
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
        return (
        <TemplateSistema>
            <div>
                <h1 styler={titulo}>Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/professor/criarExercicio">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Exercicio +
                            </button>
                            </Link>
                        </div>
                    </div>

                    <div className="input-group mb-3 col-9">
                        <input type="text" 
                        className="form-control" 
                        placeholder="Recipient's username" 
                        aria-label="Recipient's username" 
                        aria-describedby="button-addon2"/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" 
                            type="button" 
                            id="button-addon2"
                            >Pesquisar</button>
                        </div>
                    </div>
                </div>

                 <table style={lista} className="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Nota</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map((exercicios, index) => (
                        <tr key={index}>
                            <td>{exercicios.title}</td>
                            <td>8/10</td>
                            <td><button className="btn btn-primary float-right" type="submit">Ver</button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TemplateSistema>
        )
    }
}