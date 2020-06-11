import React from "react";
//import { Link } from "react-router-dom";

export default (props) => {
  const {
    numQuestion,
    // handlePage,
    totalPages,
    // idProva,
    // idAluno,
    // idTurma,
    redirecionar,
  } = props;
  const prox = parseInt(numQuestion) + 1;
  const ante = parseInt(numQuestion) - 1;
  let elementNavs = [];
  for (let i = 1; i <= totalPages; i++) {
    elementNavs = [
      ...elementNavs,
      <li
        key={i}
        className={`page-item ${i === parseInt(numQuestion) ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => redirecionar(i)}>
          {i}
        </button>
      </li>,
    ];
  }
  return (
    <nav aria-label="...">
      <ul className="pagination pagination justify-content-center">
        <li className={`page-item ${numQuestion <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => redirecionar(ante)}>
            Anterior
          </button>
        </li>
        {elementNavs}
        <li
          className={`page-item ${
            numQuestion >= totalPages || totalPages === 0 ? "disabled" : ""
          }`}
        >
          <button
            className={`page-link ${
              numQuestion >= totalPages || totalPages === 0 ? "disabled" : ""
            }`}
            onClick={() => redirecionar(prox)}
          >
            Próximo
          </button>
        </li>
      </ul>
    </nav>
  );
};
