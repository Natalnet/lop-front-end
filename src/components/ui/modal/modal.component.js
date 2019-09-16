import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

import React from 'react';
import api from '../../../services/api'
import {useState} from 'react';
import Collapse from 'components/ui/collapse/collapse.component'
import CriarListaScreen from 'screens/sistema/Professor/criarLista.screen';



export default(props) =>{
    const todaslistas= props.todaslistas
    console.log(todaslistas)

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
          Questões
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{heightMax: '400px', height: '400px'}}>
          {todaslistas.map((lista, index)=>(
          <div key={index}>
            <Collapse
            lista={lista}
            />
          </div>
          ))}
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }