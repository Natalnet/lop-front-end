import React from 'react';
import FormObjectiveQuestionSubscreen from '../../../components/screens/formObjectiveQuestion.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const ObjectiveQuestionSubscreen = (props) => {

    return (
        <>
            <TemplateSistema active="exercicios">
                <FormObjectiveQuestionSubscreen {...props}/>
            </TemplateSistema>               
        </>
    )
}

export default ObjectiveQuestionSubscreen;