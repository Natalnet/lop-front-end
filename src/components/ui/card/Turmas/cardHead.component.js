import React from "react";

export default props => {
  const { name, code, semestre, ano } = props;
  return (
    <div
      className="card-header1"
      style={{
        backgroundColor: "rgba(190,190,190,0.2)",
        maxHeight: "56px",
        paddingRight: "0px",
        paddingLeft: "0px"
      }}
    >
      <div className="col-12" style={{}}>
        <h4 className="" style={{ margin: "5px", marginTop: "10px" }}>
          <i className="fa fa-users" /> {name} - {ano}.{semestre}
        </h4>
      </div>
      <div className="col-12">
        <p
          style={{
            marginTop: "0px",
            float: "right",
            fontSize: "11px",
            fontWeight: "bold"
          }}
        >
          Código: {code}
        </p>
      </div>
    </div>
  );
};
