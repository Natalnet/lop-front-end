import React, { useEffect, useMemo } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import { Col, Row } from '../ui/grid';
import { Load } from '../ui/load'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import useCourse from '../../hooks/useCourse'
import useLesson from '../../hooks/useLesson'
import useClass from '../../hooks/useClass';

const LessonSubscreen = (props) => {

  const { classRoon, isLoadingClass, getClass } = useClass();
  const { course, isLoadingCourse, getCourse } = useCourse();
  const { lesson, isLoadingLesson, getLesson } = useLesson();

  const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);

  useEffect(() => {
    const { IdCourse, idLesson, idClass } = props.match.params;
    getCourse(IdCourse);
    getLesson(idLesson);
    idClass && getClass(idClass);

  }, []);

  if (isLoadingCourse || !course || isLoadingLesson || !lesson || isLoadingClass) {
    return <Load />
  }

  return (
    <>
      <Row className='mb-4'>
        <Col className='col-12'>
          <h5 className='m-0'>
            {
              classRoon ?
                <>
                  {classRoon.name}
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  <Link to={`/${profile}/turma/${classRoon.id}/cursos`}>Cursos</Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  <Link to={`/${profile}/turma/${classRoon.id}/cursos/${props.match.params.IdCourse}/aulas`}>{course.title}</Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />
                  {lesson.title}

                </>
                :
                <>
                  <Link to={`/${profile}/cursos`}>Cursos</Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />

                  <Link to={`/${profile}/curso/${props.match.params.IdCourse}/aulas`}>{course.title}</Link>
                  <i className="fa fa-angle-left ml-2 mr-2" />

                  {lesson.title}
                </>
            }

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