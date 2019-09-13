import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React from 'react';
import Collapse from '../../../components/ui/collapse/collapse.component'
import api from '../../../services/api'



export default(props) =>{
    const items= props.items
    console.log('no mddal')
    console.log(props)
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Listas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{heightMax: '400px', height: '400px'}}>
            <div className="input-group mb-3 col-12">
                <input type="text" 
                className="form-control" 
                placeholder="Digite o nome da lista...." 
                aria-label="Digite o nome da lista...." 
                aria-describedby="button-addon2"/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" 
                    type="button" 
                    id="button-addon2"
                    >Pesquisar
                    </button>
                </div>
            </div>
            {items.map((lista, index) => (
            <div key={index}>
            <Collapse
              lista={lista}
              key={index}
            />
            </div>
            ))}
            <p>r<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>r</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }