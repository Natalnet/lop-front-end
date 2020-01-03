import React, { useState,useRef,useEffect } from "react";
import Swal from "sweetalert2";
import Switch from "react-input-switch";
import api from "../../../services/api"

export default props => {
  const { status,id } = props;
  const hasMount = useRef(false)
  const [valueStatus, setValueStatus] = useState(status);
  useEffect(()=>{
    if(hasMount.current){
      console.log("status:",valueStatus,"id:",id)
      async function updateClass(state){
        const request = {
          updatedClass :{
            state:valueStatus
          } 
        }
        try{
          Swal.fire({
            title: "Atualizando estado a turma",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
          });
          Swal.showLoading();
          await api.put(`/class/${id}/update`,request)
          Swal.fire({
            type: "success",
            title: "Testado a turma atalizado com sucesso!"
          });
          console.log("ok")
        }
        catch(err){
          console.log(err)
          Swal.hideLoading();
          Swal.fire({
            type: "error",
            title: "Erro: Não foi possivel atualizar estado da turma"
          });
        }
      }
      updateClass(valueStatus)
    }
    else hasMount.current = true
  },[valueStatus])
  /*async function handleStatus(valueStatus,outra) {
    console.log("status:",valueStatus,"id:",id)
  }*/

  return (
    <>
     <Switch
        styles={{
          track: {
            backgroundColor: "#E33C36"
          },
          trackChecked: {
            backgroundColor: "#5B9540"
          }
        }}
        style={{
          margin: "14px"
        }}
        on="ATIVA"
        off="INATIVA"
        value={valueStatus}
        onChange={setValueStatus}
        
      />
      {valueStatus}
    </>
  );
};
