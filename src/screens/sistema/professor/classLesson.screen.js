import React from 'react';
import LessonSubScreenComponent from '../../../components/screens/lesson.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const Lessons = props =>  {
  return (
    <TemplateSistema {...props} active="cursos" submenu={"telaTurmas"}>
        <LessonSubScreenComponent {...props}/>
    </TemplateSistema>
  );
}

export default Lessons;