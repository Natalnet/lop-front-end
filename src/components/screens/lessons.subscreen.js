import React, { useMemo, useCallback, useEffect } from 'react';
import { Link } from "react-router-dom";
import useCourse from '../../hooks/useCourse';
import useLesson from '../../hooks/useLesson';
import useClass from '../../hooks/useClass';
import { Load } from '../ui/load';
import { Card, CardBody, CardFooter, CardHead, CardTitle, CardOptions } from '../ui/card';
import { Row, Col } from '../ui/grid';
import { MdModeEdit } from 'react-icons/md';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';

const LessonsSubScreenComponent = (props) => {
    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLocaleLowerCase(), []);
    const email = useMemo(() => sessionStorage.getItem("user.email").toLocaleLowerCase(), []);

    const { classRoon, isLoadingClass, getClass } = useClass();
    const { course, isLoadingCourse, getCourse } = useCourse();
    const { isLoadingLessons, lessons, getLessonsByCourse, updateVisibilidadeLesson } = useLesson();

    useEffect(() => {
        if (course) {
            if (classRoon) {
                document.title = `${classRoon.name} - ${course.title}`;

            }
            else {
                document.title = course.title;
            }
        }
    }, [classRoon, course])

    useEffect(() => {
        const { IdCourse, idClass } = props.match.params;
        getCourse(IdCourse)
        getLessonsByCourse(IdCourse);
        idClass && getClass(idClass);
    }, [])


    const handleChangeVisibilityLesson = useCallback(async (e, idLesson) => {
        updateVisibilidadeLesson(e.target.checked, idLesson)
    }, [lessons, updateVisibilidadeLesson])

    const isAuthor = useCallback(() => {
        return course && (email === course.author.email && profile === 'professor')
    }, [course, profile.email])

    if (isLoadingCourse || !course || isLoadingClass) {
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
                                    {course.title}
                                </>
                                :
                                <>
                                    <Link to={`/${profile}/cursos`}>Cursos</Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                    {course.title}
                                </>
                        }


                    </h5>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-3'>
                    {isAuthor() && (
                        <Link to={`/professor/curso/${props.match.params.IdCourse}/criarAulas`}>
                            <button
                                className="btn btn-primary w-100" type="button"
                            >
                                Criar Aula <i className="fe fe-file-plus" />
                            </button>
                        </Link>
                    )}
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <Card>
                        <CardHead
                            style={{
                                backgroundColor: "rgba(190,190,190,0.2)",
                                maxHeight: "56px",
                            }}
                        >
                            <CardTitle
                                title={course.title}
                            >
                                <p
                                    className="m-0"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {course.title}
                                </p>
                            </CardTitle>
                            <CardOptions>
                                <p
                                    className='m-0'
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Código: {course.code}
                                </p>
                            </CardOptions>
                        </CardHead>
                        <CardBody
                            className='h-auto overflow-auto'
                            style={{ height: '110px' }}
                        >
                            <div className="d-flex flex-column">
                                <p
                                    className="m-0 mb-4"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {course.title}
                                </p>
                                {course.author && course.author.email && <p
                                    className="font-italic mb-0"
                                >
                                    <b>Autor(a):</b> {course.author.email}
                                </p>}
                            </div>
                        </CardBody>
                        <CardFooter

                        >

                            <Row>
                                <Col className='col-12'>
                                    <Row>
                                        <Load className={`${!(isLoadingLessons) ? 'd-none' : ''}`} />
                                        {
                                            lessons.map((lesson) => (
                                                <Col className={`col-md-6 ${isLoadingLessons ? 'd-none' : ''}`} key={lesson.id}>
                                                    <Card>
                                                        <CardHead
                                                            style={{
                                                                backgroundColor: "rgba(190,190,190,0.2)",
                                                                maxHeight: "56px",
                                                            }}
                                                        >
                                                            <CardTitle>
                                                                <p
                                                                    className="m-0"
                                                                    style={{
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    }}
                                                                >
                                                                    {lesson.title}
                                                                </p>
                                                            </CardTitle>
                                                            <CardOptions>
                                                                {isAuthor() &&
                                                                    <Link to={`/professor/curso/${props.match.params.IdCourse}/editarAulas/${lesson.id}`}>
                                                                        <IconButton
                                                                            aria-label="edit leson"
                                                                            component="span"

                                                                        >
                                                                            <MdModeEdit size={25} />
                                                                        </IconButton>
                                                                    </Link>
                                                                }
                                                            </CardOptions>
                                                        </CardHead>
                                                        {/* <CardBody>
                                                            <p><strong>Descrição:</strong> {lesson.description}</p>
                                                        </CardBody> */}
                                                        <CardFooter
                                                            className='d-flex align-items-center justify-content-between'
                                                        >
                                                            <div
                                                                className='d-flex align-items-center h-100'
                                                            >
                                                                {isAuthor() &&
                                                                    <>
                                                                        <Switch
                                                                            checked={lesson.isVisible}
                                                                            value={lesson.isVisible}
                                                                            onChange={(e) => handleChangeVisibilityLesson(e, lesson.id)}
                                                                            color="primary"
                                                                            name="check"
                                                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                        />
                                                                        {lesson.isVisible ?
                                                                            <AiFillEye size={25} color='#467fcf' />
                                                                            :
                                                                            <AiFillEyeInvisible size={25} />
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                            <div
                                                                className='d-flex align-items-center h-100'
                                                            >
                                                                <Link to={
                                                                    props.match.params.idClass ?
                                                                        `/${profile}/turma/${props.match.params.idClass}/curso/${props.match.params.IdCourse}/aulas/${lesson.id}`
                                                                        :
                                                                        `/${profile}/curso/${props.match.params.IdCourse}/aulas/${lesson.id}`
                                                                }>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                    >
                                                                        <i className="fe fe-corner-down-right" /> Entrar
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>

        </>
    )
}

export default LessonsSubScreenComponent;