import React, { forwardRef } from "react";

const Card = (props, ref) => {
  const { children, style } = props;
  return (
    <div className="row row-cards row-deck turma" ref={ref}>
      <div className="col-12">
        <div className="card box" style={style || {}}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default forwardRef(Card);
