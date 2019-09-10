import React from 'react';
import { Button } from 'react-bootstrap';

import MyVerticallyCenteredModal from './modal.component'
import {ButtonToolbar} from 'react-bootstrap'

export default (props) =>{
    const [modalShow, setModalShow] = React.useState(false);
    
    return (
        <ButtonToolbar>
        <Button  style={{width:'100%', marginTop: '10px'}} variant="primary" onClick={() => setModalShow(true)}>
            Adicionar Listas
        </Button>
    
        <MyVerticallyCenteredModal
            items={props}
            show={modalShow}
            onHide={() => setModalShow(false)}
        />
        </ButtonToolbar>
    );
    }