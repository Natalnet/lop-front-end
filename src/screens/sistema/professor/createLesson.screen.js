import React, { useCallback, useState, Fragment, useEffect } from 'react';
import FormLessonSubScreenComponent from '../../../components/screens/formLesson.subscree';
import TemplateSistema from "../../../components/templates/sistema.template";

const CreateLesson = (props) => {

    return (
        <>
            <TemplateSistema active="cursos">
                <FormLessonSubScreenComponent {...props}/>
            </TemplateSistema>               
        </>
    )
}

export default CreateLesson;