import React from 'react';
import CoursesSubScreenComponent from '../../../components/screens/courses.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const ClassCoursesScreen = (props) => {

  return (
    <TemplateSistema {...props} active="cursos" submenu={"telaTurmas"}>
      <CoursesSubScreenComponent {...props} />
    </TemplateSistema>
  )
}

export default ClassCoursesScreen;