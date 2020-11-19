import React, { useMemo, useCallback, useState, useEffect } from 'react';
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import { Link } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useCourse from '../../hooks/useCourse';
import Swal from "sweetalert2";
import { Load } from '../ui/load';
import { Card, CardBody, CardFooter, CardHead, CardTitle, CardOptions } from '../ui/card/index'
import { IoIosAddCircleOutline, IoIosSettings, IoIosAlarm, IoMdMore } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';
import IconButton from '@material-ui/core/IconButton';

const CoursesSubScreenComponent = (props) => {
    const profile = useMemo(() => sessionStorage.getItem("user.profile"), [props]);
    const email = useMemo(() => sessionStorage.getItem("user.email"), [props]);

    const { paginedCourses, isLoadingCourses, createCourse, updateCourse, getCourses } = useCourse();

    const [openCreateCourseModal, setOpenCreateCourseModal] = useState(false);
    const [currentIdCourse, setCurrentIdCourse] = useState(null);
    const [currentTitleCourse, setCurrentTitleCourse] = useState('');
    const [currentDescriptionCourse, setCurrentDescriptionCourse] = useState('');
    const [isEditCourse, setIsEditCourse] = useState(false);
    const [isCreateCourse, setIsCreateCourse] = useState(false);

    useEffect(() => {
        getCourses();
    }, [])

    const handleCreateNewCourse = useCallback(async ({ currentTitleCourse: title, currentDescriptionCourse: description }) => {
        setIsCreateCourse(false);
        setCurrentTitleCourse('');
        setCurrentDescriptionCourse('');
        const courseCreated = await createCourse({
            title,
            description
        });
        if (courseCreated) {
            getCourses();
        }

    }, [currentTitleCourse, currentDescriptionCourse]);

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
            getCourses();

        }
    }, [currentTitleCourse, currentDescriptionCourse, currentIdCourse])

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
            title: `Tem certeza que não quer criar o curso?`,
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

    return (
        <>
            <Row mb={15}>
                <Col xs={12}>
                    <h5 className='m-0'>Cursos</h5>
                </Col>
            </Row>
            <Row mb={15}>
                <Col xs={3}>
                    {/* <Link to="/professor/criarCurso"> */}
                    <button
                        className="btn btn-primary w-100" type="button"
                        onClick={() => setIsCreateCourse(true)}
                    >
                        Criar Curso <i className="fe fe-file-plus" />
                    </button>
                    {/* </Link> */}
                </Col>
                <Col xs={9}>
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
                    !paginedCourses ? [] : paginedCourses.docs.map((course, i) => (
                        <Col xs={12} md={6}>
                            <Card>
                                <CardHead
                                    style={{
                                        backgroundColor: "rgba(190,190,190,0.2)",
                                        maxHeight: "56px",
                                    }}
                                >
                                    <CardTitle>

                                        {course.title}
                                    </CardTitle>
                                    <CardOptions>
                                        {email === course.author.email &&
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
                                    </CardOptions>
                                </CardHead>
                                <CardBody

                                >
                                    <p
                                        className='m-0'
                                        style={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Código: {course.code}
                                    </p>
                                    <p><strong>Descrição:</strong> {course.description}</p>

                                </CardBody>
                                <CardFooter
                                    className='d-flex align-items-center'
                                >

                                    <button
                                        className="btn btn-primary m-2"
                                    >
                                        <i className="fe fe-corner-down-right" /> Entrar
                                    </button>
                                    {email === course.author.email &&
                                        <button
                                            className="btn btn-primary d-flex align-items-center"
                                        >
                                            <MdModeEdit className='mr-1'/> Gerenciar aulas
                                    </button>
                                    }
                                </CardFooter>
                            </Card>
                        </Col>
                    ))
                }
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
                            <div className="form-group col-12 mb-15">
                                <div className="alert alert-info" role="alert">
                                    As aulas poderão ser criadas e adicionadas após a criação do curso.
                                </div>
                            </div>
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