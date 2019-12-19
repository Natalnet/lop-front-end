import React from "react";
import { Link } from "react-router-dom";

export default props => {
  console.log(props);
  const { children } = props;
  return <div className="card-footer1">{children}</div>;
};
