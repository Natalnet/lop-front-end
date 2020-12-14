import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Pagination } from "../ui/navs";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useCourse from '../../hooks/useCourse';
import usePagination from '../../hooks/usePagination';
import useClass from '../../hooks/useClass';
import Swal from "sweetalert2";
import { Load } from '../ui/load';
import { Card, CardBody, CardFooter, CardHead, CardTitle, CardOptions } from '../ui/card';
import { Row, Col } from '../ui/grid';
import { GiSecretBook } from 'react-icons/gi';
import { MdModeEdit } from 'react-icons/md';
import IconButton from '@material-ui/core/IconButton';
import profileImg from "../../assets/perfil.png";

const CoursesSubScreenComponent = props => {
    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);
    const email = useMemo(() => sessionStorage.getItem("user.email").toLowerCase(), []);

    const { paginedCourses, isLoadingCourses, isLoadingCoursesToAddInClass, paginedCourseToAddInClass, getCoursesToAddInClass, createCourse, updateCourse, getCourses, getCoursesByClass, addCourse, removeCourse } = useCourse();
    const { classRoon, isLoadingClass, getClass } = useClass();
    const { page, docsPerPage, totalPages, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination(1, 10);
    const { page: pageCoursesToAdd, totalPages: totalPagesCoursesToAdd, setDocsPerPage: setDocsPerPageCoursesToAdd, setPage: setPageCoursesToAdd, setTotalPages: setTotalPagesCoursesToAdd, setTotalDocs: setTotalDocsCoursesToAdd } = usePagination(1, 10);

    const [openCreateCourseModal, setOpenCreateCourseModal] = useState(false);
    const [openAddCoursesModal, setOpenAddCoursesModal] = useState(false);
    const [currentIdCourse, setCurrentIdCourse] = useState(null);
    const [currentTitleCourse, setCurrentTitleCourse] = useState('');
    const [currentDescriptionCourse, setCurrentDescriptionCourse] = useState('');
    const [isEditCourse, setIsEditCourse] = useState(false);
    const [isCreateCourse, setIsCreateCourse] = useState(false);
    const [titleOrCodeInput, setTitleOrCodeInput] = useState('');
    const [titleOrCodeInputCoursesToadd, setTitleOrCodeInputCoursesToadd] = useState('');

    useEffect(() => {
        document.title = classRoon ? `${classRoon.name} - Cursos` : 'Cursos';
    }, [classRoon])

    const handleGetCourses = useCallback((numPage = page) => {
        const { idClass } = props.match.params;
        //caso esteja sendo carregado dentro de uma turma

        if (idClass) {
            getCoursesByClass(idClass, numPage, {
                docsPerPage: 1000,
                titleOrCode: titleOrCodeInput
            });
        }
        else {
            console.log('numPage: ', numPage)

            getCourses(numPage, {
                docsPerPage,
                titleOrCode: titleOrCodeInput
            });
        }
    }, [page, docsPerPage, titleOrCodeInput, props])

    useEffect(() => {
        const { idClass } = props.match.params;
        handleGetCourses();
        idClass && getClass(idClass);
    }, [])

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedCourses) {
            setPage(paginedCourses.currentPage);
            setTotalDocs(paginedCourses.total);
            setDocsPerPage(paginedCourses.perPage);
            setTotalPages(paginedCourses.totalPages)
        }
    }, [paginedCourses, setPage, setTotalDocs, setDocsPerPage, setTotalPages])

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedCourseToAddInClass) {
            setPageCoursesToAdd(paginedCourseToAddInClass.currentPage);
            setTotalDocsCoursesToAdd(paginedCourseToAddInClass.total);
            setDocsPerPageCoursesToAdd(paginedCourseToAddInClass.perPage);
            setTotalPagesCoursesToAdd(paginedCourseToAddInClass.totalPages)
        }
    }, [paginedCourseToAddInClass, setPageCoursesToAdd, setTotalDocsCoursesToAdd, setDocsPerPageCoursesToAdd, setTotalPagesCoursesToAdd])

    const handleCreateNewCourse = useCallback(async ({ currentTitleCourse: title, currentDescriptionCourse: description }) => {
        setIsCreateCourse(false);
        setCurrentTitleCourse('');
        setCurrentDescriptionCourse('');
        const courseCreated = await createCourse({
            title,
            description
        });
        courseCreated && handleGetCourses();

    }, [createCourse, handleGetCourses]);

    const handleEditCourse = useCallback(async (id, { currentTitleCourse: title, currentDescriptionCourse: description }) => {
        setIsEditCourse(false);
        setCurrentIdCourse(null);
        setCurrentTitleCourse('');
        setCurrentDescriptionCourse('');
        const editedCourse = await updateCourse(id, {
            title,
            description
        })
        editedCourse && handleGetCourses();

    }, [updateCourse, handleGetCourses])

    useEffect(() => {
        if ((isEditCourse && currentIdCourse) || isCreateCourse) {
            setOpenCreateCourseModal(true);
        }
        else {
            setOpenCreateCourseModal(false);
        }
    }, [isEditCourse, isCreateCourse, currentIdCourse])

    const handleOpenAddCourseModal = useCallback(() => {
        //console.log(paginedCourses.docs.length)
        setOpenAddCoursesModal(true);
        getCoursesToAddInClass(pageCoursesToAdd, {
            idNotIn: paginedCourses.docs.map(p => p.id).join(' ')
        })
    }, [pageCoursesToAdd, paginedCourses, getCoursesToAddInClass])

    const handleCloseCreateCoursoModal = useCallback(async () => {
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
        handleGetCourses(numPage);
    }, [setPage, handleGetCourses]);

    const handlePageCoursesToAdd = useCallback((e, numPage) => {
        e.preventDefault();
        setPageCoursesToAdd(numPage);
        getCoursesToAddInClass(numPage, {
            idNotIn: paginedCourses.docs.map(p => p.id).join(' ')
        })
    }, [setPageCoursesToAdd, getCoursesToAddInClass, paginedCourses]);

    const handleAddCourse = useCallback(async (idCourse) => {
        const { idClass } = props.match.params;
        setOpenAddCoursesModal(false);
        setTitleOrCodeInputCoursesToadd('');
        const courseAdded = await addCourse({
            class_id: idClass,
            course_id: idCourse
        })
        courseAdded && handleGetCourses();
    }, [addCourse, handleGetCourses])

    const handleRemoveCourse = useCallback(async (course) => {
        const { idClass } = props.match.params;
        const { value } = await Swal.fire({
            title: `Tem certeza que quer remover "${course.title}" da turma?`,
            //text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, remover curso!",
            cancelButtonText: "Não, cancelar!",
        });
        if (!value) return null;
        const courseRemoved = await removeCourse({
            class_id: idClass,
            course_id: course.id
        });
        courseRemoved && handleGetCourses();
    }, [removeCourse, handleGetCourses])

    const isTeacher = useCallback(() => {
        return profile === 'professor'
    }, [profile])

    const isAuthor = useCallback((author) => {
        return email === author.email && isTeacher()
    }, [email, isTeacher])

    if (isLoadingClass) {
        return <Load />
    }

    return (
        <>
            <Row className='mb-4'>
                <Col className='col'>
                    <h5 className='m-0'>
                        {
                            classRoon && (
                                <>
                                    {classRoon.name}
                                    <i className="fa fa-angle-left ml-2 mr-2" />

                                </>
                            )
                        }
                        Cursos
                    </h5>
                </Col>
            </Row>
            <Row className='mb-4'>
                {isTeacher() && (

                    <Col className='col-3'>
                        {props.match.params.idClass ?
                            <button
                                className="btn btn-primary w-100" type="button"
                                onClick={() => handleOpenAddCourseModal()}
                            >
                                Adicionar curso <i className="fe fe-file-plus" />
                            </button>
                            :
                            <button
                                className="btn btn-primary w-100" type="button"
                                onClick={() => setIsCreateCourse(true)}
                            >
                                Criar Curso <i className="fe fe-file-plus" />
                            </button>
                        }
                    </Col>
                )}
                <Col className='col-9'>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder='Título ou código'
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={titleOrCodeInput}
                            onChange={(e) => setTitleOrCodeInput(e.target.value)}
                        />
                        <button
                            className='btn btn-secondary btn-outline-secondary'
                            disabled={isLoadingCourses}
                            type="button"
                            id="button-addon2"
                            onClick={handleGetCourses}
                        >
                            <i className="fe fe-search" />
                        </button>
                        <button
                            className='btn btn-secondary btn-outline-secondary'
                            disabled={isLoadingCourses}
                            type="button"
                            id="button-addon3"
                            onClick={() => {
                                setTitleOrCodeInput('');
                                if (props.match.params.idClass) {
                                    getCoursesByClass(props.match.params.idClass, page, {
                                        docsPerPage: 100,
                                        titleOrCode: ''
                                    });
                                }
                                else {
                                    getCourses(page, {
                                        docsPerPage,
                                        titleOrCode: ''
                                    });
                                }
                            }}
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
                        <Col className={`col-md-6 ${isLoadingCourses ? 'd-none' : ''}`} key={course.id}>
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
                                    className='d-flex align-items-center'
                                >
                                    <div className="d-flex flex-column h-100 w-100">
                                        <div
                                            className='d-flex align-items-center  justify-content-between h-100'
                                        >
                                            <div
                                                className='d-flex align-items-center h-100'
                                            >
                                                <div
                                                    className="avatar d-block"
                                                    style={{
                                                        float: "left",
                                                        margin: "5px 5px 5px 0px",
                                                        backgroundImage: `url(${course.author.urlImage || profileImg
                                                            })`,
                                                    }}
                                                />
                                                <div
                                                    className='m-1 mr-2'
                                                    style={{

                                                        alignItems: "center",
                                                        textAlign: "left",
                                                        float: "left",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {course.author.name}
                                                    <div className="row" />
                                                    {course.author.email}
                                                </div>
                                                <ul className="d-flex align-items-center m-0 p-0">
                                                    <li
                                                        className="d-flex mr-4 ml-4 align-items-center"
                                                        title={`${course.lessonsCount} curso(s)`}
                                                    >
                                                        {/* <i className="fa fa-users mr-1" /> */}
                                                        <GiSecretBook className="mr-1 " />
                                                        {course.lessonsCount}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div
                                                className='d-flex align-items-center h-100'
                                            >
                                                <Link to={
                                                    props.match.params.idClass ?
                                                        `/${profile}/turma/${props.match.params.idClass}/cursos/${course.id}/aulas`
                                                        :
                                                        `/${profile}/curso/${course.id}/aulas`
                                                }>
                                                    <button
                                                        className="btn btn-primary m-2"
                                                    >
                                                        <i className="fe fe-corner-down-right" /> Entrar
                                                    </button>

                                                </Link>
                                                {
                                                    props.match.params.idClass && (
                                                        <button className="btn btn-danger" onClick={() => handleRemoveCourse(course)}>
                                                            <i className="fa fa-trash " />
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
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


            {/* Modal para criar/editar cursos */}

            <Dialog
                open={openCreateCourseModal}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={() => handleCloseCreateCoursoModal()}
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
                        onClick={() => handleCloseCreateCoursoModal()}
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

            {/* Modal para adicionar cursos à uma turma */}

            <Dialog
                open={openAddCoursesModal}
                onClose={() => {
                    setOpenAddCoursesModal(false);
                    setTitleOrCodeInputCoursesToadd('')
                }}
                aria-labelledby="contained-modal-title-vcenter"
                maxWidth='md'
            >
                <DialogTitle id="contained-modal-title-vcenter">
                    Adicionar cursos
                </DialogTitle>
                <DialogContent>
                    {isLoadingCoursesToAddInClass || !paginedCourseToAddInClass ?
                        <Load />
                        :
                        <>
                            <Row className='mb-4'>
                                <Col className='col'>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='Título ou código'
                                            aria-label="Recipient's username"
                                            aria-describedby="button-addon2"
                                            value={titleOrCodeInputCoursesToadd}
                                            onChange={(e) => setTitleOrCodeInputCoursesToadd(e.target.value)}
                                        />
                                        <button
                                            className='btn btn-secondary btn-outline-secondary'
                                            disabled={isLoadingCourses}
                                            type="button"
                                            id="button-addon2"
                                            onClick={() => getCoursesToAddInClass(pageCoursesToAdd, {
                                                titleOrCode: titleOrCodeInputCoursesToadd,
                                                idNotIn: paginedCourses.docs.map(p => p.id).join(' ')
                                            })}
                                        >
                                            <i className="fe fe-search" />
                                        </button>
                                        <button
                                            className='btn btn-secondary btn-outline-secondary'
                                            disabled={isLoadingCourses}
                                            type="button"
                                            id="button-addon3"
                                            onClick={() => {
                                                getCoursesToAddInClass(pageCoursesToAdd, {
                                                    titleOrCodeInput: titleOrCodeInputCoursesToadd,
                                                    idNotIn: paginedCourses.docs.map(p => p.id).join(' ')
                                                })
                                                setTitleOrCodeInputCoursesToadd('')
                                            }
                                            }
                                        >
                                            <i className="fe fe-refresh-cw" />
                                        </button>
                                    </div>
                                </Col>

                            </Row>
                            {!paginedCourseToAddInClass ? [] : paginedCourseToAddInClass.docs.map((course) => (

                                <Row className='mb-4' key={course.id}>
                                    <Col className='col'>
                                        <Card

                                            style={{
                                                width: '720px',
                                                maxWidth: '100%'
                                            }}
                                        >
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

                                            <CardFooter
                                                className='d-flex align-items-center'
                                            >
                                                <div className="d-flex flex-column h-100 w-100">
                                                    <div
                                                        className='d-flex align-items-center  justify-content-between h-100'
                                                    >
                                                        <div
                                                            className='d-flex align-items-center h-100'
                                                        >
                                                            <div
                                                                className="avatar d-block"
                                                                style={{
                                                                    float: "left",
                                                                    margin: "5px 5px 5px 0px",
                                                                    backgroundImage: `url(${course.author.urlImage || profileImg
                                                                        })`,
                                                                }}
                                                            />
                                                            <div
                                                                className='m-1 mr-2'
                                                                style={{

                                                                    alignItems: "center",
                                                                    textAlign: "left",
                                                                    float: "left",
                                                                    fontSize: "10px",
                                                                }}
                                                            >
                                                                {course.author.name}
                                                                <div className="row" />
                                                                {course.author.email}
                                                            </div>
                                                            <ul className="d-flex align-items-center m-0 p-0">
                                                                <li
                                                                    className="d-flex mr-4 ml-4 align-items-center"
                                                                    title={`${course.lessonsCount} curso(s)`}
                                                                >
                                                                    {/* <i className="fa fa-users mr-1" /> */}
                                                                    <GiSecretBook className="mr-1 " />
                                                                    {course.lessonsCount}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div
                                                            className='d-flex align-items-center h-100'
                                                        >
                                                            <button
                                                                onClick={() => handleAddCourse(course.id)}
                                                                className="btn btn-primary m-2"
                                                            >
                                                                Adicionar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>
                            ))}
                            <Row>
                                <Col className='col-12 text-center'>
                                    <Pagination
                                        count={totalPagesCoursesToAdd}
                                        page={Number(pageCoursesToAdd)}
                                        onChange={handlePageCoursesToAdd}
                                        color="primary"
                                        size="large"
                                        disabled={isLoadingCoursesToAddInClass}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CoursesSubScreenComponent;