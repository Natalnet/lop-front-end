import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'

const card = {
    maxHeight: "250px",
    minHeight: "250px"
}

const botaoV = {
    float: "right",
}

const botao = {
    width: "100%"
}

const estilo = {
    paddingBottom: "25%"
}

export default class TurmasScreen extends Component {
    state = {
        redirect: false,
        items: [],
        perfil: localStorage.getItem("user.profile")
    }

    componentDidMount() {
        this.getTurmas();
    }

    async getTurmas(){
        try{
            const response = await api.get('/class')
            this.setState({items:response.data})
        }catch(err){
            console.log(err)
        
        }
    };

    setRedirect = () => {
        this.setState({
          redirect: true
        })
      }
    renderRedirect = () => {
    if (this.state.redirect) {
        return <Redirect to='/professor/novasturmas' />
    }
    }

    render() {
        if(this.state.perfil!=="PROFESSOR"){
            return <Redirect to="/*" />;
        }
        return (
        <TemplateSistema>
            <div className="row">
                <div className="col-3">
                    <div>
                    {this.renderRedirect()}
                        <button 
                            onClick={this.setRedirect}
                            className="btn btn-primary"
                            type="button"
                            style={botao}
                        >
                            Nova Turma +
                        </button>
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

                {this.state.items.map((turma, index) => (
                    <div key={index} className="col-6">
                        <br></br>
                        <div className="card">
                            <h5 className="card-header">Nome: {turma.name} / Ano: {turma.year}.{turma.semester}</h5>
                            <div className="card-body" style={card}>
                                <p className="card-text" style={estilo}>Descrição: {turma.description}</p>
                                <a href="#" style={botaoV} className="btn btn-primary">Ver</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TemplateSistema>
        )
    }
}