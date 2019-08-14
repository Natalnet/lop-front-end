import React, { Component } from "react";
import { Redirect } from 'react-router-dom'

const botao = {
    borderRadius: "50%",
    fontSize: "100px",
    height: "200px",
    width: "200px",
    border: "solid 1px"
}

const estilo = {
    justifyContent: 'center',
    alignItems: 'center',
    background: "0",
    border: "0",
    display: "flex",
    position: "relative"
}

export default class turmas extends Component {
    state = {
        redirect: false,
        items: []
    }

    componentDidMount() {
        this.getTurmas();
    }

    getTurmas = () => {
        let dbfile = "http://localhost:3001/professor/classes";
        fetch(dbfile)
            .then(res => res.json())
            .then(data => {
                data.map(turma => {
                return this.setState({
                    items: [
                    ...this.state.items,
                    turma.name + ", " + turma.year + ", " + turma.description
                    ]
                });
                });
            })
            .catch(e => console.log(e));
    };

    setRedirect = () => {
        this.setState({
          redirect: true
        })
      }
      renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/sistema/turmas/novasturmas' />
        }
      }

    render(){
        return (
            <div className="row">
                <div className="col-3" style={estilo}>
                    <div>
                    {this.renderRedirect()}
                        <button 
                            onClick={this.setRedirect}
                            className="btn btn-primary"
                            type="button"
                            style={botao}
                        >
                            +
                        </button>
                    </div>
                </div>

                {this.state.items.map((turma, index) => (
                    <div key={index} className="col-3">
                        <div className="card">
                            <h5 className="card-header">Nome: {turma.year}</h5>
                            <div className="card-body">
                                <h5 className="card-title">Ano: </h5>
                                <h5 className="card-title">Semestre: </h5>
                                <p className="card-text">Descrição: </p>
                                {/*<a href="#" className="btn btn-primary">Ver</a>*/}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        );
    }
 
}
