import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { idTurma, participantes, solicitacoes, status } = props;
  return (
    <div className="card-footer1">
      <label className="custom-switch" style={{ margin: "10px" }}>
        <input
          type="radio"
          name="option"
          value="1"
          className="custom-switch-input"
          checked=""
        />
        <span className="custom-switch-indicator"></span>
        <span className="custom-switch-description">{status}</span>
      </label>
      {/* <span
        title={`${participantes} participante(s)`}
        className="avatar avatar-cyan mr-1"
        style={{ margin: "5px" }}
      >
        {participantes}
      </span>

      <span
        title={`${solicitacoes} solicitação(ões)`}
        className="avatar avatar-red mr-1"
        style={{ margin: "5px" }}
      >
        {solicitacoes}
      </span> */}

      <Link to={`/professor/turma/${idTurma}/editar`}>
        <button
          style={{ float: "right", margin: "2px" }}
          className="btn btn-success mr-2"
        >
          <i className="fa fa-edit" /> Editar
        </button>
      </Link>
      <Link to={`/professor/turma/${idTurma}/participantes`}>
        <button
          style={{ float: "right", margin: "2px" }}
          className="btn btn-primary mr-2"
        >
          <i className="fe fe-corner-down-right" /> Entrar
        </button>
      </Link>
    </div>
  );
};
