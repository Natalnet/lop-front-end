import React, { useState } from "react";
import Switch from "react-input-switch";

function func(value) {
  console.log(value);
}

export default props => {
  const { status } = props;
  const [value, setValue] = useState(status);

  return (
    <div>
      <Switch
        styles={{
          track: {
            backgroundColor: "#E33C36"
          },
          trackChecked: {
            backgroundColor: "#374796"
          }
        }}
        style={{
          margin: "14px"
        }}
        on="ATIVA"
        off="INATIVA"
        value={value}
        onChange={setValue}
        onClick={func(value)}
      />
      {value}
    </div>
  );
};
