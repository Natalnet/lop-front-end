import React, { useState } from "react";

export default props => {
  const { id } = props;
  const [show] = useState(false);
  function handleCollapse() {
    //setShow(!show)
  }
  return (
    <i
      title={"title"}
      style={{ color: "blue", cursor: "pointer", fontSize: "25px" }}
      className={`fe fe-chevron-${show ? "up" : "down"}`}
      onClick={handleCollapse}
      data-toggle="collapse"
      data-target={`#${id}`}
      aria-expanded="false"
    />
  );
};
