import React, { useCallback, useState, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import Col from "../ui/grid/col.component";
import Row from "../ui/grid/row.component";
import {Load} from '../ui/load'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useCourse from '../../hooks/useCourse'
const FormCourseSunscreen = (props) => {
    const { course, isLoadingCourse, getCourse } = useCourse();

    useEffect(() => {
        const { IdCourse } = props.match.params;
        getCourse(IdCourse)
    }, [])

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

    if (isLoadingCourse || !course) {
        return <Load />
    }

    return (
        <>

                <Row mb={15}>
                    <Col xs={12}>
                        <h5 className='m-0'>
                            <Link to="/professor/cursos">Cursos</Link>
                            <i className="fa fa-angle-left ml-2 mr-2" />
                            <Link to={`/professor/curso/${props.match.params.IdCourse}/aulas`}>{course.title}</Link>
                            <i className="fa fa-angle-left ml-2 mr-2" />
                            Criar Aula
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <span className="alert-danger">{''}</span>
                    </Col>
                </Row>
                <Row>
                <div className="form-group col-md-12">
                    <label>Título da aula: </label>
                    <input
                        type="text"
                        onChange={()=>null}
                        className={`form-control`}
                        placeholder="Título da aula"
                        value={''}
                        required
                    />
                </div>
                <div className="form-group col-md-12">
                    <label>Conteúdo: </label>
                    <SunEditor
                        lang="pt_br"
                        minHeight="400"
                        onChange={()=>null}
                        setContents={''}
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
                </div>
                </Row>
        </>
    )
}

export default FormCourseSunscreen;