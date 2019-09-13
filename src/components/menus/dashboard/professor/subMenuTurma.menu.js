import React from 'react'
import { Link } from "react-router-dom";

export default()=>{
    return(
    <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg order-lg-first">
                <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                    <li className="nav-item">
                    <Link to="/professor/turma/:id/participantes" className="nav-link">
                        <i className="fe fe-bar-chart" />
                        Participantes
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link to="/professor/turma/:id" className="nav-link">
                        <i className="fe fe-bar-chart" />
                        Listas
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link to="/professor/turma/:id/provas" className="nav-link">
                        <i className="fe fe-bar-chart" />
                        Provas
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link to="/professor/turma/:id/solicitacoes" className="nav-link">
                        <i className="fe fe-bar-chart" />
                        Solicitações
                    </Link>
                    </li>
                </ul>
                </div>
            </div>
        </div>
    </div>
    )
}