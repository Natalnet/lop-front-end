import React,{ useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import { Col, Row } from '../ui/grid';
import { Load } from '../ui/load'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import useCourse from '../../hooks/useCourse'
import useLesson from '../../hooks/useLesson'

const LessonSubscreen = (props) => {

  const { course, isLoadingCourse, getCourse } = useCourse();
  const { lesson, isLoadingLesson, getLesson } = useLesson();

  useEffect(() => {
    const { IdCourse, idLesson } = props.match.params;
    getCourse(IdCourse);
    getLesson(idLesson);
  }, []);

  if (isLoadingCourse || !course || isLoadingLesson || !lesson) {
    return <Load />
  }

  return (
    <>
      <Row className='mb-4'>
        <Col className='col-12'>
          <h5 className='m-0'>
            <Link to="/professor/cursos">Cursos</Link>
            <i className="fa fa-angle-left ml-2 mr-2" />

            <Link to={`/professor/curso/${props.match.params.IdCourse}/aulas`}>{course.title}</Link>
            <i className="fa fa-angle-left ml-2 mr-2" />

            {lesson.title}
          </h5>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='col-12'>
          <SunEditor
            lang="pt_br"
            height="auto"
            disable={true}
            showToolbar={false}
            setContents={lesson.description}
            setDefaultStyle="font-size: 15px; text-align: justify"
            setOptions={{
              toolbarContainer: '#toolbar_container',
              resizingBar: false,
              katex: katex,
            }}
          />
        </Col>
      </Row>
    </>
  )

}

export default LessonSubscreen;