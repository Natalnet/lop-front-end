import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'components/ui/modal/modalExercicios.component';
import {ButtonToolbar} from 'react-bootstrap'
export default (props) =>{
    const [modalShow, setModalShow] = React.useState(false);
    const questao=props.questao
    
    return (
        <ButtonToolbar>

        <Button
            style={{marginRight:"5px"}} 
            className="btn btn-primary" 
            onClick={() => setModalShow(true)}
            variant="primary"
            >
            <i className="fa fa-info"/>
        </Button>
        
        <Modal
            questao={questao}
            show={modalShow}
            onHide={() => setModalShow(false)}
        />

       
        </ButtonToolbar>
    );
    }