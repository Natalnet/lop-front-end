import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { idTurma, participantes, provas, listas } = props;
  return (
    <div className="card-footer1">
      <div
        className="avatar d-block"
        style={{
          float: "left",
          margin: "5px",
          backgroundImage: `url("https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg"})`
        }}
      />
      <div
        style={{
          margin: "4px",
          alignItems: "center",
          textAlign: "left",
          float: "left",
          fontSize: "10px"
        }}
      >
        professor1
        <div className="row" />
        professor1@gmail.com
      </div>
      <Link
        to={`/aluno/turma/${idTurma}/dashboard`}
        style={{
          float: "right",
          marginTop: "2px",
          backgroundColor: "#2FB0C6",
          borderColor: "#2FB0C6"
        }}
        className="btn btn-primary mr-2"
      >
        <i className="fe fe-corner-down-right" />
        Entrar
      </Link>
      {/*estático*/}
      <ul className="social-links list-inline mb-0 mt-2">
        <li
          className="list-inline-item  ml-4"
          title={`${participantes} participante(s)`}
        >
          <i className="fa fa-users mr-1" />
          {participantes}
        </li>
        <li className="list-inline-item" title={`${listas} lista(s)`}>
          <i className="fe fe-file-text mr-1" />
          {listas}
        </li>
        <li className="list-inline-item" title={`${provas} prova(s)`}>
          <i className="fa fa-file-text-o mr-1" />
          {provas}
        </li>
      </ul>
    </div>
  );
};
