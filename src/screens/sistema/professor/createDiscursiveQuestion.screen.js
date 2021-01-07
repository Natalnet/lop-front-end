import React from 'react';
import FormDiscursiveQuestionSubscreen from '../../../components/screens/formDiscursiveQuestion.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const CreateDiscursiveQuestionScreen = (props) => {

    return (
        <>
            <TemplateSistema active="exercicios">
                <FormDiscursiveQuestionSubscreen {...props}/>
            </TemplateSistema>               
        </>
    )
}

export default CreateDiscursiveQuestionScreen;