import React from 'react';
import LessonSubScreenComponent from '../../../components/screens/lesson.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const Lesson = (props) => {

    return (
        <>
            <TemplateSistema active="cursos">
                <LessonSubScreenComponent {...props} />
            </TemplateSistema>               
        </>
    )
}

export default Lesson;