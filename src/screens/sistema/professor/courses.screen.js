import React from 'react';
import CoursesSubScreenComponent from '../../../components/screens/courses.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

// import { Container } from './styles';

const CoursesScreen = (props) => {

  return (
  <TemplateSistema active="cursos">
    <CoursesSubScreenComponent {...props}/>
  </TemplateSistema>
  )
}

export default CoursesScreen;