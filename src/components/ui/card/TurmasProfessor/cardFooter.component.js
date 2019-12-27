import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { idTurma, participantes, solicitacoes, status } = props;
  return <div className="card-footer1">{props.children}</div>;
};
