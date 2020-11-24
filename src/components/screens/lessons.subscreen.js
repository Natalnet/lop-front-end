import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Pagination } from "../ui/navs";
import useCourse from '../../hooks/useCourse';
import usePagination from '../../hooks/usePagination';
import Swal from "sweetalert2";
import { Load } from '../ui/load';
import { Card, CardBody, CardFooter, CardHead, CardTitle, CardOptions } from '../ui/card';
import { Row, Col } from '../ui/grid';
// import Row from "../ui/grid/row.component";
// import Col from "../ui/grid/col.component";
import { GiSecretBook } from 'react-icons/gi';
import { MdModeEdit } from 'react-icons/md';
import IconButton from '@material-ui/core/IconButton';

const LessonsSubScreenComponent = (props) => {
    const profile = useMemo(() => sessionStorage.getItem("user.profile"), [props]);
    const email = useMemo(() => sessionStorage.getItem("user.email"), [props]);

    const { course, isLoadingCourse, getCourse } = useCourse();
    //const { page, docsPerPage, totalPages, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination(1, 10);

    useEffect(() => {
        const { IdCourse } = props.match.params;
        getCourse(IdCourse)
    }, [])

    // useEffect(() => {
    //     if (paginedLessons) {
    //         setPage(paginedLessons.currentPage);
    //         setTotalDocs(paginedLessons.total);
    //         setDocsPerPage(paginedLessons.perPage);
    //         setTotalPages(paginedLessons.totalPages)
    //     }
    // }, [paginedLessons])


    // const handlePage = useCallback((e, numPage) => {
    //     e.preventDefault();
    //     setPage(numPage);
    //     getLessons(numPage, { docsPerPage });
    // }, [docsPerPage]);

    const isAuthor = useCallback(() => {
        return course && (email === course.author.email && profile === 'PROFESSOR')
    }, [course, profile.email])

    if (isLoadingCourse || !course) {
        return <Load />
    }
    return (
        <>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <h5 className='m-0'>
                        <Link to="/professor/cursos">Cursos</Link>
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        {course.title}
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
                        <CardBody className='h-auto'>
                            {course.description}
                        </CardBody>
                        <CardFooter
                            className='d-flex align-items-center justify-content-between'
                        >

                            <Row>
                                <Col className='col-12'>
                                    <p>Listar os cursos aqui</p>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col className='col-12 text-center'>
                                    <Pagination
                                        count={totalPages}
                                        page={Number(page)}
                                        onChange={handlePage}
                                        color="primary"
                                        size="large"
                                        disabled={isLoadingLessons}
                                    />
                                </Col>
                            </Row> */}
                        </CardFooter>
                    </Card>
                </Col>
            </Row>

            {/* <Row>
                <Load className={`${!(isLoadingLessons) ? 'd-none' : ''}`} />
                {
                    !paginedLessons ? [] : paginedLessons.docs.map((lesson) => (
                        <Col  className='col-md-6' key={lesson.id}>
                            <Card>
                                <CardHead
                                    style={{
                                        backgroundColor: "rgba(190,190,190,0.2)",
                                        maxHeight: "56px",
                                    }}
                                >
                                    <CardTitle
                                        title={lesson.title}
                                    >
                                        <p
                                            className="m-0"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {isAuthor(lesson.author) &&
                                                <IconButton
                                                    aria-label="edit leson"
                                                    component="span"
                                                    onClick={() => {
                                                        setCurrentTitleCourse(lesson.title);
                                                        setCurrentDescriptionCourse(lesson.description);
                                                        setCurrentIdCourse(lesson.id);
                                                        setIsEditCourse(true)
                                                    }}
                                                >
                                                    <MdModeEdit size={25} />
                                                </IconButton>
                                            }
                                            {lesson.title}
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
                                            Código: {lesson.code}
                                        </p>
                                    </CardOptions>
                                </CardHead>
                                <CardBody>
                                    <p><strong>Descrição:</strong> {lesson.description}</p>
                                </CardBody>
                                <CardFooter
                                    className='d-flex align-items-center justify-content-between'
                                >
                                    <div
                                        className='d-flex align-items-center h-100'
                                    >
                                    </div>
                                    <div
                                        className='d-flex align-items-center h-100'
                                    >
                                        <Link to={`/professor/curso/${lesson.id}/lessons`}>
                                            <button
                                                className="btn btn-primary m-2"
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
            </Row> */}
        </>
    )
}

export default LessonsSubScreenComponent;