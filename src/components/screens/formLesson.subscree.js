import React, { useCallback, useState, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import { Col, Row } from '../ui/grid';
import { Load } from '../ui/load'
import 'katex/dist/katex.min.css'
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useCourse from '../../hooks/useCourse'
import useLesson from '../../hooks/useLesson'

const FormCourseSubscreen = ({ isEditLesson, ...props }) => {
    const { course, isLoadingCourse, getCourse } = useCourse();
    const { lesson, isLoadingLesson, createLesson, updateLesson, getLesson } = useLesson();

    const [titleLesson, setTitleLesson] = useState('')
    const [descriptionLesson, setDescriptionLesson] = useState('')

    const history = useHistory();

    useEffect(() => {
        const { IdCourse, idLesson } = props.match.params;
        getCourse(IdCourse)
        if (isEditLesson) {
            getLesson(idLesson)
        }
    }, [])

    useEffect(() => {
        if (lesson) {
            setTitleLesson(lesson.title);
            setDescriptionLesson(lesson.description);
        }
    }, [lesson])

    const handleCreateLesson = useCallback(async () => {
        const { IdCourse } = props.match.params;
        const isCreated = await createLesson({
            title: titleLesson,
            description: descriptionLesson,
            course_id: IdCourse
        })
        if (isCreated) {
            history.push(`/professor/curso/${IdCourse}/aulas`)
        }
    }, [props, titleLesson, descriptionLesson])

    const handleEditLesson = useCallback(async () => {
        const { IdCourse, idLesson } = props.match.params;
        const isEdited = await updateLesson(idLesson, {
            title: titleLesson,
            description: descriptionLesson,
        })
        if (isEdited) {
            history.push(`/professor/curso/${IdCourse}/aulas`)
        }
    }, [props, titleLesson, descriptionLesson])

    const handleImageUploadBefore = useCallback(async () => {
        await Swal.fire({
            type: "error",
            title: "Não é permitido o upload de imagens, carregue-as a partir de um link 😃",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        }, [])
        return false;
    }, [])

    const handleVideoUploadBefore = useCallback(async () => {
        await Swal.fire({
            type: "error",
            title: "Não é permitido o upload de vídeos, carregue-os a partir de um link 😃",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        return false;
    }, [])

    if (isLoadingCourse || !course || isLoadingLesson) {
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
                            Criar Aula
                        </h5>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <span className="alert-danger">{''}</span>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className="col-12">
                    <label>Título da aula: </label>
                    <input
                        type="text"
                        onChange={e => setTitleLesson(e.target.value)}
                        className={`form-control`}
                        placeholder="Título da aula"
                        value={titleLesson}
                        required
                    />
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className="col-12">
                    <label>Conteúdo: </label>
                    <SunEditor
                        lang="pt_br"
                        height = 'auto'
                        minHeight="800px"
                        onChange={content => setDescriptionLesson(content)}
                        setContents={descriptionLesson}
                        onImageUploadBefore={handleImageUploadBefore}
                        onVideoUploadBefore={handleVideoUploadBefore}
                        setDefaultStyle="font-size: 15px; text-align: justify"
                        setOptions={{
                            toolbarContainer: '#toolbar_container',
                            // resizingBar : false,
                            //charCounter : true,
                            //maxCharCount : 720,
                            katex: katex,
                            buttonList: [
                                ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat', 'textStyle', 'paragraphStyle'],
                                ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table', 'codeView', 'math'],
                                ['link', 'image', 'video', 'audio', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save']
                            ],
                        }}
                    />
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <button
                        type="button"
                        onClick={isEditLesson ? handleEditLesson : handleCreateLesson}
                        disabled={!(titleLesson && descriptionLesson)}
                        className={`btn btn-primary btn-lg btn-block ${'' && "btn-loading"}`}
                    >
                        Salvar
                    </button>
                </Col>
            </Row>
        </>
    )
}

export default FormCourseSubscreen;