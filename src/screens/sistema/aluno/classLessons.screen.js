import React from 'react';
import LessonsSubScreenComponent from '../../../components/screens/lessons.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const Lessons = props =>  {
  return (
    <TemplateSistema {...props} active="cursos" submenu={"telaTurmas"}>
        <LessonsSubScreenComponent {...props}/>
    </TemplateSistema>
  );
}

export default Lessons;