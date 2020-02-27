import React, { useState,useRef,useEffect } from "react";
import Switch from "react-input-switch";

export default props => {
  const { status,id ,onChange,style} = props;
  const hasMount = useRef(false)
  const [valueStatus, setValueStatus] = useState(status);
  useEffect(()=>{
    if(hasMount.current){
      console.log("status:",valueStatus,"id:",id)
      onChange(valueStatus,id)
    }
    else hasMount.current = true
  },[valueStatus])

  return (
     <Switch
        styles={{
          track: {
            backgroundColor: "#E33C36"
          },
          trackChecked: {
            backgroundColor: "#5B9540"
          }
        }}
        style={style}
        on="ATIVA"
        off="INATIVA"
        value={valueStatus}
        onChange={setValueStatus}
        
      />
  );
};
