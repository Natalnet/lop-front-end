import React, { Component } from "react";
import { Link } from "react-router-dom";

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class listaExercicios extends Component {
    state = {
        redirect: false,
        items: []
    }

    componentDidMount() {
        this.getTurmas();
    }

    getTurmas = () => {
        let dbfile = "http://localhost:3001/listQuestion";
        fetch(dbfile)
            .then(res => res.json())
            .then(data => {
                data.map(lista => {
                return this.setState({
                    items: [
                    ...this.state.items,
                    lista
                    ]
                });
                });
            })
            .catch(e => console.log(e));
    };

    render(){
        return (
            
            <div>
                <h1 styler={titulo}>Listas de Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/sistema/professor/criarlista" className="nav-link">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Lista+
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
                            <th>Data</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map((lista, index) => (
                        <tr key={index}>
                            <td>{lista.title}</td>
                            <td>20.10</td>
                            <td>
                            <button className="btn btn-primary float-right" type="submit">Ver</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
 
}
