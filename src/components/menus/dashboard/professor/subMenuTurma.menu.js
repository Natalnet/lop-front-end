import React, { useMemo, useContext } from 'react'
import { Link } from "react-router-dom";
import { GiTeacher } from 'react-icons/gi'

const SubMenuTurma = props => {

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
                                <Link to="/professor" className="nav-link">
                                    <i className="fa fa-arrow-left" />
                            Voltar
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/participantes`} className={`nav-link ${active === 'participantes' ? 'active' : ''}`}>
                                    <i className="fa fa-users" />
                            Participantes
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/listas`} className={`nav-link ${active === 'listas' ? 'active' : ''}`}>
                                    <i className="fa fa-file-text" />
                            Listas
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/provas`} className={`nav-link ${active === 'provas' ? 'active' : ''}`}>
                                    <i className="fa fa-file-text-o" />
                            Provas
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/solicitacoes`} className={`nav-link ${active === 'solicitações' ? 'active' : ''}`}>
                                    <i className="fe fe-users" />
                            Solicitações
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/submissoes`} className={`nav-link ${active === 'submissoes' ? 'active' : ''}`}>
                                    <i className="fa fa-code" />
                            Submissões
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/cursos`} className={`nav-link ${active === 'cursos' ? 'active' : ''}`}>
                                    <GiTeacher className='mr-1' />
                            Cursos
                        </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/professor/turma/${id}/dashboard`} className={`nav-link ${active === 'dashboard' ? 'active' : ''}`}>
                                    <i className="fa fa-pie-chart" />
                            DashBoard
                        </Link>
                            </li>
                        </ul>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '0px 25px',
                        gridTemplateAreas: `
                            ". ."
                            ". ."
                            
                            `,
                    }}>

                    </div>
                </div>
            </div>
        </div>
    )

}
export default SubMenuTurma;