import React, { useCallback, useState, Fragment, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import { Link } from "react-router-dom";
import Card from "../ui/card/card.component";
import CardBody from "../ui/card/cardBody.component";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IoIosAddCircleOutline, IoIosSettings } from 'react-icons/io';
import Swal from "sweetalert2";
import CardHead from "../../components/ui/card/cardHead.component";
import CardTitle from "../../components/ui/card/cardTitle.component";
import CardOptions from "../../components/ui/card/cardOptions.component";
import CardFooter from "../../components/ui/card/cardFooter.component";

const FormCourseSunscreen = () => {

    const [openLessonModal, setOpenLessonModal] = useState(false);
    const [titleCourse, setTitleCourse] = useState('');
    const [descriptionCourse, setDescriptionCourseCourse] = useState('');
    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState(null);
    const [currentIndexLesson, setCurrentIndexLesson] = useState(null);

    const handleOpenNewLessonModal = useCallback(() => {
        setNewLesson({
            description: '',
            title: ''
        })
        setOpenLessonModal(true);
    }, [])

    const handleCloseModal = useCallback(async () => {
        setOpenLessonModal(false);
        const { value } = await Swal.fire({
            title: `Tem certeza que não quer salvar a aula atual?`,
            //text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, tenho!",
            cancelButtonText: "Não, volta à criação/edição da aula!",
        });
        setOpenLessonModal(true);
        if (!value) {
            return null
        }
        if (newLesson) {
            setNewLesson(null);
        }
        else {
            setCurrentIndexLesson(null);
        }
    }, [newLesson]);

    const handleSaveLesson = useCallback(async () => {
        if (newLesson) {
            console.log('new lesson: ',newLesson);
            setLessons((oldLessons => [...oldLessons, newLesson]));
            setNewLesson(null);
        }
        else {
            setCurrentIndexLesson(null);
        }
    }, [newLesson]);

    const handleDescriptionLesson = useCallback((content) => {
        if (newLesson) {
            const tempNewLeson = { ...newLesson };
            tempNewLeson.description = content;
            setNewLesson(tempNewLeson);
        }
        else {
            const tempLessons = [...lessons];
            tempLessons[currentIndexLesson].description = content;
            setLessons(tempLessons);
        }

    }, [newLesson, currentIndexLesson, lessons]);

    useEffect(()=>{
        console.log(lessons)
    }, [lessons])

    const handleTitleLesson = useCallback((e) => {
        if (newLesson) {
            const tempNewLeson = { ...newLesson };
            tempNewLeson.title = e.target.value;
            console.log(tempNewLeson.title)
            setNewLesson(tempNewLeson);
        }
        else {
            const tempLessons = [...lessons];
            tempLessons[currentIndexLesson].title = e.target.value;
            setLessons(tempLessons);
        }
    }, [newLesson, currentIndexLesson, lessons]);


    const handleImageUploadBefore = useCallback(() => {
        Swal.fire({
            type: "error",
            title: "Não é permitido o upload de imagens, carregue-as a partir de um link 😃",
        }, []);
        return false;
    }, [])
    const handleVideoUploadBefore = useCallback(() => {
        Swal.fire({
            type: "error",
            title: "Não é permitido o upload de vídeos, carregue-os a partir de um link 😃",
        });
        return false;
    }, [])

    return (
        <>
            <Row mb={15}>
                <Col xs={12}>
                    <h5 className='m-0'>
                        <Link to="/professor/cursos">Cursos</Link>
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        Criar Curso
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <span className="alert-danger">{''}</span>
                </Col>
                <Col xs={12}>
                    <Card>
                        <CardBody>
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
                                            value={titleCourse}
                                            onChange={(e) => setTitleCourse(e.target.value)}
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
                                            value={descriptionCourse}
                                            onChange={(e) => setDescriptionCourseCourse(e.target.value)}
                                        ></textarea>
                                    </div>
                                        {
                                            lessons.map((lesson, i) => (
                                                <Fragment key={i}>
                                                    <div className="form-group col-12 col-lg-6 mb-15">                                                        
                                                        <Card>
                                                            <CardHead
                                                                style={{
                                                                    backgroundColor: "rgba(190,190,190,0.2)",
                                                                    maxHeight: "56px",
                                                                }}
                                                            >
                                                                <CardTitle>
                                                                    {lesson.title}
                                                                </CardTitle>
                                                                <CardOptions>
                                                                    <button
                                                                        className='btn btn-primary d-flex align-items-center'
                                                                        type='button'
                                                                    >
                                                                        <IoIosSettings size={25}/>
                                                                    </button>
                                                                </CardOptions>
                                                            </CardHead>
                                                            <CardBody className="card-class overflow-auto">
                                                                <p>
                                                                    {/* <b>Descrição do curso:</b> &nbsp; {lesson.description} */}
                                                                </p>
                                                            </CardBody>
                                                            <CardFooter>

                                                            </CardFooter>
                                                        </Card>
                                                    </div>
                                                </Fragment>
                                            ))
                                        }

                                    <div className="form-group col-12">
                                        <button
                                            className='btn btn-success m-auto d-flex'
                                            type='button'
                                            onClick={() => handleOpenNewLessonModal()}
                                        >
                                            Adicionar aula <IoIosAddCircleOutline size={25} className='ml-1' />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {
                (newLesson || currentIndexLesson) && <Dialog
                    fullWidth={true}
                    maxWidth='md'
                    open={openLessonModal}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    onClose={() => handleCloseModal()}
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <DialogTitle id="contained-modal-title-vcenter">
                        Custom Modal Styling
                </DialogTitle>
                    <DialogContent>
                        <div className="form-group col-md-12">
                            <label>Título da aula: </label>
                            <input
                                type="text"
                                onChange={handleTitleLesson}
                                className={`form-control`}
                                placeholder="Título da aula"
                                value={newLesson ? newLesson.title : lessons[currentIndexLesson].title}
                                required
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label>Conteúdo: </label>
                            <SunEditor
                                lang="pt_br"
                                minHeight="250"
                                height="auto"
                                // disable={true}
                                // showToolbar={false}
                                onChange={handleDescriptionLesson}
                                setContents={newLesson ? newLesson.description : lessons[currentIndexLesson].description}
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
                    </DialogContent>
                    <DialogActions>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleSaveLesson()}
                        >
                            Salvar aula
                    </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleCloseModal()}
                        >
                            Fechar
                    </button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}

export default FormCourseSunscreen;