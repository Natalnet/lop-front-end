import React from "react";

export default props => {
  const { description } = props;
  return (
    <div
      className="card-body1"
      style={{ marginTop: "5px", paddingRight: "5px" }}
    >
      <b>Descrição: </b>
      {description.slice(0, 120) + "..."}
    </div>
  );
};
