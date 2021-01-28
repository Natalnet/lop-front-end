import React, { useMemo } from 'react'
import { Link } from "react-router-dom";
import { GiTeacher } from 'react-icons/gi'

export default props => {
    const id = useMemo(() => {
        return props.match.params.id || props.match.params.idClass
    }, [props])
    const active = useMemo(() => props.active, [props])
    return (
        <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg order-lg-first">
                        <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                            <li className="nav-item">
                                <Link to="/aluno" className="nav-link">
                                    <i className="fa fa-arrow-left" />
                            Voltar
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/aluno/turma/${id}/dashboard`} className={`nav-link ${active === 'dashBoard' ? 'active' : ''}`}>
                                    <i className="fa fa-pie-chart" />
                            DashBoard
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/aluno/turma/${id}/listas`} className={`nav-link ${active === 'listas' ? 'active' : ''}`}>
                                    <i className="fa fa-file-text" />
                            Listas
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/aluno/turma/${id}/participantes`} className={`nav-link ${active === 'participantes' ? 'active' : ''}`}>
                                    <i className="fa fa-users" />
                            Participantes
                        </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={`/aluno/turma/${id}/provas`} className={`nav-link ${active === 'provas' ? 'active' : ''}`}
                                >
                                    <i className="fa fa-file-text-o" />
                            Provas
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/aluno/turma/${id}/cursos`} className={`nav-link ${active === 'cursos' ? 'active' : ''}`}>
                                    <GiTeacher className='mr-1' />
                            Cursos
                        </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

}