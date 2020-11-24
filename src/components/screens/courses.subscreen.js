import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Pagination } from "../ui/navs";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

const CoursesSubScreenComponent = (props) => {
    const profile = useMemo(() => sessionStorage.getItem("user.profile"), [props]);
    const email = useMemo(() => sessionStorage.getItem("user.email"), [props]);

    const { paginedCourses, isLoadingCourses, createCourse, updateCourse, getCourses } = useCourse();
    const { page, docsPerPage, totalPages, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination(1, 10);

    const [openCreateCourseModal, setOpenCreateCourseModal] = useState(false);
    const [currentIdCourse, setCurrentIdCourse] = useState(null);
    const [currentTitleCourse, setCurrentTitleCourse] = useState('');
    const [currentDescriptionCourse, setCurrentDescriptionCourse] = useState('');
    const [isEditCourse, setIsEditCourse] = useState(false);
    const [isCreateCourse, setIsCreateCourse] = useState(false);

    useEffect(() => {
        getCourses(page, { docsPerPage });
    }, [])

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedCourses) {
            setPage(paginedCourses.currentPage);
            setTotalDocs(paginedCourses.total);
            setDocsPerPage(paginedCourses.perPage);
            setTotalPages(paginedCourses.totalPages)
        }
    }, [paginedCourses])

    const handleCreateNewCourse = useCallback(async ({ currentTitleCourse: title, currentDescriptionCourse: description }) => {
        setIsCreateCourse(false);
        setCurrentTitleCourse('');
        setCurrentDescriptionCourse('');
        const courseCreated = await createCourse({
            title,
            description
        });
        if (courseCreated) {
            getCourses(page, { docsPerPage });
        }
    }, [currentTitleCourse, currentDescriptionCourse, page, docsPerPage]);

    const handleEditCourse = useCallback(async (id, { currentTitleCourse: title, currentDescriptionCourse: description }) => {
        setIsEditCourse(false);
        setCurrentIdCourse(null);
        setCurrentTitleCourse('');
        setCurrentDescriptionCourse('');
        const editedCourse = await updateCourse(id, {
            title,
            description
        })
        if (editedCourse) {
            getCourses(page, { docsPerPage });

        }
    }, [currentTitleCourse, currentDescriptionCourse, currentIdCourse, page, docsPerPage])

    useEffect(() => {
        if ((isEditCourse && currentIdCourse) || isCreateCourse) {
            setOpenCreateCourseModal(true);
        }
        else {
            setOpenCreateCourseModal(false);
        }
    }, [isEditCourse, isCreateCourse, currentIdCourse])

    const handleCloseModal = useCallback(async () => {
        setOpenCreateCourseModal(false);
        const { value } = await Swal.fire({
            title: `Tem certeza que não quer salvar o curso?`,
            //text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, tenho!",
            cancelButtonText: "Não, voltar!",
        });
        if (value) {
            //Sim, tenho!
            setIsCreateCourse(false);
            setIsEditCourse(false);
            setCurrentTitleCourse('');
            setCurrentDescriptionCourse('')
            return null;
        }
        setOpenCreateCourseModal(true);
    }, []);

    const handlePage = useCallback((e, numPage) => {
        e.preventDefault();
        setPage(numPage);
        getCourses(numPage, { docsPerPage });
    }, [docsPerPage]);

    const isAuthor = useCallback((author) => {
        return email === author.email && profile === 'PROFESSOR'
    }, [email, profile])

    return (
        <>
            <Row className='mb-4'>
                <Col className='col'>
                    <h5 className='m-0'>Cursos</h5>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-3'>
                    {/* <Link to="/professor/criarCurso"> */}
                    <button
                        className="btn btn-primary w-100" type="button"
                        onClick={() => setIsCreateCourse(true)}
                    >
                        Criar Curso <i className="fe fe-file-plus" />
                    </button>
                    {/* </Link> */}
                </Col>
                <Col className='col-9'>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder='Título ou código'
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={''}
                            onChange={(e) => null}
                        />
                        <button
                            className={`btn btn-secondary btn-outline-secondary `}
                            type="button"
                            id="button-addon2"
                            onClick={() => null}
                        >
                            <i className="fe fe-search" />
                        </button>
                        <button
                            className={`btn btn-secondary btn-outline-secondary ${undefined /*loading && 'btn-loading'*/}`}
                            type="button"
                            id="button-addon3"
                            onClick={() => null}
                        >
                            <i className="fe fe-refresh-cw" />
                        </button>
                    </div>
                </Col>
            </Row>

            <Row>
                <Load className={`${!(isLoadingCourses) ? 'd-none' : ''}`} />
                {
                    !paginedCourses ? [] : paginedCourses.docs.map((course) => (
                        <Col  className='col-md-6' key={course.id}>
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
                                            {isAuthor(course.author) &&
                                                <IconButton
                                                    aria-label="edit leson"
                                                    component="span"
                                                    onClick={() => {
                                                        setCurrentTitleCourse(course.title);
                                                        setCurrentDescriptionCourse(course.description);
                                                        setCurrentIdCourse(course.id);
                                                        setIsEditCourse(true)
                                                    }}
                                                >
                                                    <MdModeEdit size={25} />
                                                </IconButton>
                                            }
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
                                <CardBody>
                                    <p><strong>Descrição:</strong> {course.description}</p>
                                </CardBody>
                                <CardFooter
                                    className='d-flex align-items-center justify-content-between'
                                >
                                    <div
                                        className='d-flex align-items-center h-100'
                                    >
                                        <ul className="d-flex align-items-center m-0 p-0">
                                            <li
                                                className="d-flex mr-4 align-items-center"
                                                title={`${course.lessonsCount} curso(s)`}
                                            >
                                                {/* <i className="fa fa-users mr-1" /> */}
                                                <GiSecretBook className="mr-1" />
                                                {course.lessonsCount}
                                            </li>
                                        </ul>
                                    </div>
                                    <div
                                        className='d-flex align-items-center h-100'
                                    >
                                        <Link to={`/professor/curso/${course.id}/aulas`}>
                                            <button
                                                className="btn btn-primary m-2"
                                            >
                                                <i className="fe fe-corner-down-right" /> Entrar
                                            </button>
                                        </Link>
                                        {/* {isAuthor(course.author) &&
                                            <Link to={`/professor/curso/${course.id}/criarAulas`}>
                                                <button
                                                    className="btn btn-primary d-flex align-items-center"
                                                >
                                                    <MdModeEdit className='mr-1' /> Gerenciar aulas
                                                </button>
                                            </Link>
                                        } */}
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
            <Row>
                <Col className='col-12 text-center'>
                    <Pagination
                        count={totalPages}
                        page={Number(page)}
                        onChange={handlePage}
                        color="primary"
                        size="large"
                        disabled={isLoadingCourses}
                    />
                </Col>
            </Row>

            <Dialog
                open={openCreateCourseModal}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={() => handleCloseModal()}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <DialogTitle id="contained-modal-title-vcenter">
                    {isCreateCourse ? 'Criar curso' : `Editar curso: ${currentTitleCourse}`}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="form-row">
                            <div className="form-group col-12">
                                <label htmlFor="title">Título: </label>
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    className="form-control"
                                    placeholder="Título do curso"
                                    value={currentTitleCourse}
                                    onChange={(e) => setCurrentTitleCourse(e.target.value)}
                                />
                            </div>
                            <div className="form-group col-12 mb-15">
                                <label htmlFor="description">Descrição: </label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Descrição do curso"
                                    rows="5"
                                    required
                                    value={currentDescriptionCourse}
                                    onChange={(e) => setCurrentDescriptionCourse(e.target.value)}
                                ></textarea>
                            </div>
                            {isCreateCourse &&
                                <div className="form-group col-12 mb-15">
                                    <div className="alert alert-info" role="alert">
                                        As aulas poderão ser criadas e adicionadas após a criação do curso.
                                </div>
                                </div>}
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => handleCloseModal()}
                    >
                        Fechar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (isCreateCourse) {
                                handleCreateNewCourse({ currentTitleCourse, currentDescriptionCourse })
                            }
                            else {
                                handleEditCourse(currentIdCourse, { currentTitleCourse, currentDescriptionCourse })
                            }
                        }}
                        disabled={!currentTitleCourse || !currentDescriptionCourse}
                    >
                        Salvar curso
                    </button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default CoursesSubScreenComponent;