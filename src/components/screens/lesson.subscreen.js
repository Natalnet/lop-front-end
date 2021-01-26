import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import { Col, Row } from '../ui/grid';
import { Card, CardBody, CardHead, CardOptions, CardTitle, CardFooter } from '../ui/card';
import { FaCheck } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Load } from '../ui/load'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import useCourse from '../../hooks/useCourse'
import useLesson from '../../hooks/useLesson'
import useClass from '../../hooks/useClass';
import useQuestion from '../../hooks/useQuestion';

const LessonSubscreen = (props) => {

  const { classRoon, isLoadingClass, getClass } = useClass();
  const { course, isLoadingCourse, getCourse } = useCourse();
  const { lesson, isLoadingLesson, getLesson } = useLesson();
  const { getIconTypeQuestion } = useQuestion();

  const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);
  const isTeacher = useCallback(() => {
    return profile === 'professor'
  }, [profile])

  const isStudent = useCallback(() => {
    return profile === 'aluno'
  }, [profile])

  useEffect(() => {
    if (lesson) {
      document.title = lesson.title;
      if (classRoon) {
        document.title = `${classRoon.name} - ${lesson.title}`;
      }
    }

  }, [classRoon, lesson]);

  const editorRef = useRef([]);

  useEffect(() => {
    const { IdCourse, idLesson, idClass } = props.match.params;
    getCourse(IdCourse);
    getLesson(idLesson, { idClass });
    idClass && getClass(idClass);
  }, []);

  if (isLoadingCourse || !course || isLoadingLesson || !lesson || isLoadingClass) {
    return <Load />
  }
  if (props.match.params.idClass && (!classRoon || isLoadingClass)) {
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
          <Card>
            <CardBody>
            <div className='w-100 ' ref={(el) => editorRef.current[0] = el}>
              <SunEditor
                lang="pt_br"
                height="auto"
                disable={true}
                showToolbar={false}
                setContents={lesson.description}
                onLoad={() => {
                  editorRef.current[0].classList.add('sun-editor-wrap')
                }}
                setDefaultStyle="font-size: 15px; text-align: justify"
                setOptions={{
                  toolbarContainer: '#toolbar_container',
                  resizingBar: false,
                  katex: katex,
                }}
              />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='col-12'>
          <Card>
            <CardHead className='m-0'>
              <Col className='col-4 pl-0'>
                <h4 className='m-0'>
                  <b>Exercícios</b>
                </h4>
              </Col>
              {/* <ProgressBar
                numQuestions={lesson.questionsCount}
                numQuestionsCompleted={lesson.questionsCompletedSumissionsCount}
                dateBegin={lesson.classHasListQuestion.createdAt}
                dateEnd={lesson.classHasListQuestion.submissionDeadline}
                width={100}
              /> */}
            </CardHead>
            <CardBody>
              <Row>
                {lesson.questions.map((question, i) => (
                  <Col className='col-12 col-md-6' key={i}>
                    <Card>
                      <CardHead>
                        <CardTitle>
                          <p
                            className='d-flex m-0'
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {question.isCorrect && (
                              <span>
                                <FaCheck size={15} color='#5eba00' className='mr-2' />
                              </span>
                            )}
                            {
                              getIconTypeQuestion(question.type)
                            }

                            {question.title}
                          </p>
                        </CardTitle>
                        <CardOptions>
                          <i
                            title="Ver descrição"
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              fontSize: "25px"
                            }}
                            className={`fe fe-chevron-down`}
                            data-toggle="collapse"
                            data-target={
                              "#collapse2" + i + (lesson.id)
                            }
                            aria-expanded={false}
                          />
                        </CardOptions>
                      </CardHead>
                      <div
                        className="collapse"
                        id={"collapse2" + i + (lesson.id)}
                      >
                        <CardBody>
                          <div className='w-100' ref={(el) => editorRef.current[i] = el}>
                            <SunEditor
                              lang="pt_br"
                              height="auto"
                              disable={true}
                              showToolbar={false}
                              setContents={question.description}
                              setDefaultStyle="font-size: 15px; text-align: justify"
                              onLoad={() => {
                                editorRef.current[i].classList.add('sun-editor-wrap')
                              }}
                              setOptions={{
                                toolbarContainer: '#toolbar_container',
                                resizingBar: false,
                                katex: katex,
                              }}
                            />
                          </div>
                        </CardBody>

                      </div>
                      <CardFooter>
                        <div className='h-100 w-100 d-flex align-items-center justify-content-between'>
                          <div className='h-100 d-flex align-items-center' >

                            {isTeacher() && props.match.params.idUser ?
                              <span>Submissões do aluno: {question.submissionsCount}</span>
                              :
                              <span>Suas submissões: {question.submissionsCount}</span>
                            }
                          </div>

                          <div className='h-100 d-flex align-items-center' >
                            {isStudent() ? (

                              <Link to={
                                props.match.params.idClass ?
                                  `/${profile}/turma/${props.match.params.idClass}/aula/${lesson.id}/exercicio/${question.id}`
                                  :
                                  `/${profile}/aula/${lesson.id}/exercicio/${question.id}`
                              }>
                                <button
                                  className="btn btn-success mr-2"
                                  style={{ float: "right" }}
                                >
                                  Acessar <i className="fa fa-wpexplorer" />
                                </button>
                              </Link>
                            )
                              :
                              (isTeacher() && props.match.params.idUser) ? (
                                <Link to={`/professor/turma/${props.match.params.idClass}/participantes/${props.match.params.idUser}/aulas/${lesson && lesson.id}/exercicio/${question.id}`}>
                                  <button
                                    className="btn btn-success mr-2"
                                    style={{ float: "right" }}
                                  >
                                    Ver submissões{" "}
                                    <i className="fa fa-wpexplorer" />
                                  </button>
                                </Link>
                              )
                                :
                                isTeacher() ? (
                                  <>
                                    <Link to={
                                      props.match.params.idClass ?
                                        `/${profile}/turma/${props.match.params.idClass}/aula/${lesson.id}/exercicio/${question.id}`
                                        :
                                        `/${profile}/aula/${lesson.id}/exercicio/${question.id}`
                                    }>                                      <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                        Acessar <i className="fa fa-wpexplorer" />
                                      </button>
                                    </Link>
                                    {/* {question.type === 'PROGRAMMING' && props.match.params.idClass &&
                                      <>
                                        <span style={{ cursor: 'pointer' }} className="card-dropdown h-100" data-toggle="dropdown" aria-expanded="false">
                                          <BsThreeDotsVertical size={25} />
                                        </span>
                                        <div className="dropdown-menu dropdown-menu-demo">
                                          <Link className="dropdown-item" to={`/professor/turma/${props.match.params.idClass}/aula/${lesson.id}/exercicio/${question.id}/submissoes`}>
                                            Ver última submissão dos alunos
                                                                                    </Link>
                                          <Link className="dropdown-item" to={`/professor/turma/${props.match.params.idClass}/aula/${lesson.id}/exercicio/${question.id}/submissoes/plagio`}>
                                            Verificar Plágios
                                                                                   </Link>
                                        </div>
                                      </>
                                    } */}
                                  </>
                                )
                                  :
                                  null
                            }
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )

}

export default LessonSubscreen;