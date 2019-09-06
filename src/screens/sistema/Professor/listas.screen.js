import React, { Component } from "react";
import { Link } from "react-router-dom";

import {Redirect} from 'react-router-dom'

import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class HomeListasScreen extends Component {
    state = {
        redirect: false,
        items: [],
        perfil: localStorage.getItem("user.profile")
    }

    componentDidMount() {
        this.getListas();
    }

    async getListas(){
        try{
            const response = await api.get('/listQuestion')
            this.setState({items:response.data})
        }catch(err){        
            console.log(err);
        }
    };

    render() {
        if(this.state.perfil!=="PROFESSOR"){
            return <Redirect to="/401" />;
        }
        return (
        <TemplateSistema>
            <div>
                <h1 styler={titulo}>Listas de Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/professor/criarlista" className="nav-link">
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
                            <th><a className="btn">Nome</a></th>
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
        </TemplateSistema>
        )
    }
}