import React from 'react';
import { Button } from 'react-bootstrap';

import MyVerticallyCenteredModal from '../modal/modalQuestoes.component'
import {ButtonToolbar} from 'react-bootstrap'

export default (props) =>{
    const questions = props.lista.questions;    
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <ButtonToolbar>
              <Button 
                className="btn btn-primary float-right" 
                type="submit"
                onClick={() => setModalShow(true)}
                variant="primary"
                >
                <i className="fa fa-info"/>
                </Button>
       
    
    
        <MyVerticallyCenteredModal
            questions={questions}
            show={modalShow}
            onHide={() => setModalShow(false)}
        />
        </ButtonToolbar>
    );
    }