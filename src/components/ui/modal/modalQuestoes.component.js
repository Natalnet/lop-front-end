import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React from 'react';
import Collapse from '../collapse/collapseQuestoes.component'
import api from '../../../services/api'



export default(props) =>{
  const lista=props.questions

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
          {lista.map((questoes, index)=>(
            <Collapse
            questoes={questoes}
          />
          ))}
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }