import React from 'react';
import FormLessonSubScreenComponent from '../../../components/screens/formLesson.subscree';
import TemplateSistema from "../../../components/templates/sistema.template";

const CreateLesson = (props) => {

    return (
        <>
            <TemplateSistema active="cursos">
                <FormLessonSubScreenComponent {...props} isEditLesson/>
            </TemplateSistema>               
        </>
    )
}

export default CreateLesson;