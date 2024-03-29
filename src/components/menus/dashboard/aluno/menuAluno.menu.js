/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

// Referência para icones: https://preview.tabler.io/icons.html

import React, { useContext } from "react";
import { GiTeacher } from 'react-icons/gi'
import { Link } from "react-router-dom";
import SubMenuTurmas from './subMenuTurma.menu'

const MenuAluno = props => {
  
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
                <Link to="/aluno" className={`nav-link ${props.active === 'home' ? 'active' : ''}`}>
                  <i className="fe fe-home" />
                    Início
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/aluno/turmasAbertas" className={`nav-link ${props.active === 'turmasAbertas' ? 'active' : ''}`}>
                  <i className="fe fe-users" />
                    Turmas abertas
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/aluno/exercicios" className={`nav-link ${props.active === 'exercicios' ? 'active' : ''}`}>
                  <i className="fa fa-code" />
                    Exercícios
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="/aluno/cursos" className={`nav-link ${props.active === 'cursos' ? 'active' : ''}`}>
                  <GiTeacher className='mr-1' />
                    Cursos
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
  );
}


export default MenuAluno;