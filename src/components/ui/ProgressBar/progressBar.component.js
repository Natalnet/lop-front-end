import React from "react";

export default props => {
  let cor;
  if (props.porcentagem < 30) {
    cor = "bg-red";
  } else if (props.porcentagem >= 30 && props.porcentagem < 70) {
    cor = "bg-yellow";
  } else {
    cor = "bg-green";
  }

  let largura;
  if (props.largura) {
    largura = props.largura;
  } else {
    largura = 45;
  }

  let date;
  if (props.data !== true) {
    date = "Jun 11, 2015 - Jul 10, 2015";
  } else {
    date = props.data;
  }
  return (
    <div style={{ width: largura + "%" }}>
      <div className="clearfix">
        <div className="float-left">
          {console.log(largura)}
          <strong>{props.porcentagem + "%"}</strong>
        </div>
        <div className="float-right">
          <small className="text-muted">{date}</small>
        </div>
      </div>
      <div className="progress progress-xs">
        <div
          className={("progress-bar", cor)}
          role="progressbar"
          style={{ width: props.porcentagem + "%" }}
          aria-valuenow={props.porcentagem}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};
