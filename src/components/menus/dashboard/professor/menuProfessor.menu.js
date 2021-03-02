/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

// Referência para icones: https://preview.tabler.io/icons.html

import React, { useEffect } from "react";
import { GiTeacher } from 'react-icons/gi'
import { Link } from "react-router-dom";
import SubMenuTurmas from './subMenuTurma.menu'
import useSubmission from '../../../../hooks/useSubmission'

const MenuProfessor = props => {

  const { getCountsubmisssions, countSubmissions } = useSubmission();

  useEffect(() => {
    getCountsubmisssions();
  }, []);

  useEffect(() => {
    if (countSubmissions > 0) {
      sessionStorage.setItem('countSubmissions', countSubmissions);
    }

  }, [countSubmissions]);
  if (props.submenu === 'telaTurmas') {
    return <SubMenuTurmas {...props} />
  }

  return (
    <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg order-lg-first">
            <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
              <li className="nav-item">
                <Link to="/professor" className={`nav-link ${props.active === 'home' ? 'active' : ''}`}>
                  <i className="fe fe-home" />
                    Início
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/professor/listas" className={`nav-link ${props.active === 'listas' ? 'active' : ''}`}>
                  <i className="fe fe-file-text" />
                    Listas
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/professor/exercicios" className={`nav-link ${props.active === 'exercicios' ? 'active' : ''}`}>
                  <i className="fa fa-file-code-o" />
                    Exercícios
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/professor/provas" className={`nav-link ${props.active === 'provas' ? 'active' : ''}`}>
                  <i className="fe fe-file" />
                    Provas
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/professor/cursos" className={`nav-link ${props.active === 'cursos' ? 'active' : ''}`}>
                  <GiTeacher className='mr-1' />
                    Cursos
                  </Link>
              </li>
            </ul>
          </div>
          <div >
            {(countSubmissions > 0 || sessionStorage.getItem('countSubmissions')) && (
              <p className='m-0'>
                {countSubmissions || sessionStorage.getItem('countSubmissions')} submissões</p>
            )
            }
          </div>
        </div>
      </div>
    </div>
  );

}
export default MenuProfessor;