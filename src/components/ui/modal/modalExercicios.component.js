import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

import React from "react";
import api from "../../../services/api";
import { useState } from "react";
import Collapse from "components/ui/collapse/collapse.component";
import CriarListaScreen from "screens/sistema/Professor/criarLista.screen";

export default (props) => {
  const questao = props.questao;
  const [open, setOpen] = useState(false);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {questao.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ heightMax: "400px", height: "400px" }}>
          <b>Descrição: </b>
          <p>{questao.description}</p>
          <br />
          <br />
          <div className="row">
            <div className="col-6">
              <b>Entradas: </b>
              {questao.results.map((resultados) => (
                <p>{resultados.inputs}</p>
              ))}
            </div>

            <div className="col-6">
              <b>saidas: </b>
              {questao.results.map((resultados) => (
                <p>{resultados.output}</p>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
