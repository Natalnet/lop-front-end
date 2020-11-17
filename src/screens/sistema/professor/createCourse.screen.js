import React from 'react';
import FormCourseSunscreen from '../../../components/screens/formaCourse.subscrenn';
import TemplateSistema from "../../../components/templates/sistema.template";


const createCourseScreen = (props) => {
    return (
        <TemplateSistema active="cursos">
            <FormCourseSunscreen {...props} />
        </TemplateSistema>
    )
}

export default createCourseScreen;