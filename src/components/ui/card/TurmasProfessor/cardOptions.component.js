import React from "react";

function colorLinguagem(linguagens) {
  if (linguagens === "javascript") {
    return (
      <span
        className="badge badge-pill badge-success"
        style={{ backgroundColor: "#F6E03A" }}
      >
        {linguagens}
      </span>
    );
  }
  if (linguagens === "cpp") {
    return (
      <span
        className="badge badge-pill badge-success"
        style={{ backgroundColor: "#6599D2" }}
      >
        {linguagens}
      </span>
    );
  }
}

export default props => {
  const { linguagens } = props;
  return (
    <div
      className="card-body1"
      style={{
        textAlign: "center",
        borderRight: "solid 1px",
        borderColor: "rgba(0, 40, 100, 0.12)"
      }}
    >
      <b>Linguagens:</b>
      {linguagens.map((linguagens, index) => (
        <div key={index}>
          {colorLinguagem(linguagens)}

          {/* {console.log(linguagens.width())} */}
        </div>
      ))}
    </div>
  );
};
