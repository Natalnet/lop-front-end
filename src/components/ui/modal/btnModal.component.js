import React from 'react';
import { Button } from 'react-bootstrap';

import Modal from './modal.component'
import {ButtonToolbar} from 'react-bootstrap'

export default (props) =>{
    const [modalShow, setModalShow] = React.useState(false);
    const todaslistas=props.listas

    return (
        <ButtonToolbar>
        <Button  style={{width:'100%', marginTop: '10px'}} variant="primary" onClick={() => setModalShow(true)}>
            Adicionar Listas
        </Button>
    
        <Modal
            {...props}
            todaslistas={todaslistas}
            show={modalShow}
            onHide={() => setModalShow(false)}
        />
        </ButtonToolbar>
    );
    }