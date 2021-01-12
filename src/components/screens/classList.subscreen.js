import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { Link } from "react-router-dom";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Card, CardBody, CardHead, CardOptions, CardTitle, CardFooter } from '../ui/card';
import { Row, Col } from '../ui/grid';
import { Load } from '../ui/load';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ProgressBar from "../ui/ProgressBar/progressBar.component";
import { FaCheck } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useClass from '../../hooks/useClass';
import useList from '../../hooks/useList';
import useQuestion from '../../hooks/useQuestion';
import useUser from '../../hooks/useUser';
import moment from "moment";

const ClassListSubscreen = props => {

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);

    const { getIconTypeQuestion } = useQuestion();

    const { classRoon, isLoadingClass, getClass } = useClass();
    const { list, isLoadingList, getList, addSubmissionDeadline } = useList();
    const { user, isLoadingUser, getUser } = useUser();
    const editorRef = useRef([]);
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateInput, setDateInput] = useState('');
    const [timeInput, setTimeInput] = useState('');

    useEffect(() => {
        if (classRoon && list) {
            document.title = `${classRoon.name} - ${list.title}`;
        }
    }, [classRoon, list]);

    useEffect(() => {
        //console.log(props.match.params)
        const { idClass, idList, idUser } = props.match.params;
        getClass(idClass);
        const queryParams = {
            idClass
        }
        if (idUser) {
            queryParams.idUser = idUser;
            getUser(idUser);
        }
        getList(idList, queryParams);
    }, []);

    useEffect(() => {
        if (list && list.classHasListQuestion.submissionDeadline) {
            setDateInput(moment(list.classHasListQuestion.submissionDeadline).format("YYYY-MM-DD"));
            setTimeInput(moment(list.classHasListQuestion.submissionDeadline).format("HH:mm"));
        }
        else {
            setDateInput('');
            setTimeInput('');
        }
    }, [list]);

    const handleAddSubmissionDeadline = useCallback(async () => {
        const { idClass, idList } = props.match.params;
        const submissionDeadline = moment(`${dateInput} ${timeInput}:59`).utc();
        setShowDateModal(false);
        await addSubmissionDeadline(idList, idClass, submissionDeadline);
        getList(idList, { idClass });
    }, [dateInput, timeInput, addSubmissionDeadline, getList]);

    const isTeacher = useCallback(() => {
        return profile === 'professor'
    }, [profile])

    const isStudent = useCallback(() => {
        return profile === 'aluno'
    }, [profile])

    if (isLoadingClass || !classRoon || isLoadingList || !list) {
        return <Load />
    }
    if (props.match.params.idUser && (isLoadingUser || !user)) {
        return <Load />
    }

    return (
        <>
            <Row className='mb-4'>
                <Col className='col-12'>

                    <h5 className='m-0'>
                        <i className="fa fa-users mr-2" aria-hidden="true" />
                        {classRoon.name} - {classRoon.year}.{classRoon.semester}
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        {
                            !props.match.params.idUser && (
                                <>
                                    <Link
                                        to={`/${profile}/turma/${props.match.params.idClass}/listas`}
                                    >
                                        Listas
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                </>
                            )
                        }
                        {
                            props.match.params.idUser && (
                                <>
                                    <Link
                                        to={`/professor/turma/${props.match.params.idClass}/participantes`}
                                    >
                                        Participantes
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                    <Link
                                        to={`/professor/turma/${props.match.params.idClass}/participantes/${props.match.params.idUser}/listas`}
                                    >
                                        {user.name}
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                </>
                            )
                        }
                        {list.title}

                    </h5>

                </Col>
            </Row>
            {isTeacher() && (
                <Row className='mb-4'>
                    <Col className='col-6'>
                        <button
                            className='btn btn-primary'
                            onClick={() => setShowDateModal(true)}
                        >
                            {list.classHasListQuestion.submissionDeadline ?
                                "Editar data limite para submissões"
                                :
                                "Adicionar data limite para submissões"
                            }
                        </button>
                    </Col>
                </Row>
            )}
            <Row className='mb-4'>
                <Col className='col-12'>
                    <Card>
                        <CardHead style={{ margin: "0px" }}>
                            <Col className='col-4 pl-0'>
                                <h4 className='m-0'>
                                    <b>{list.title}</b>
                                </h4>
                            </Col>
                            <ProgressBar
                                numQuestions={list.questionsCount}
                                numQuestionsCompleted={list.questionsCompletedSumissionsCount}
                                dateBegin={list.classHasListQuestion.createdAt}
                                dateEnd={list.classHasListQuestion.submissionDeadline}
                                width={100}
                            />
                        </CardHead>
                        <CardBody>
                            <Row>
                                {list.questions.map((question, i) => (
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
                                                            "#collapse2" + i + (list && list.id)
                                                        }
                                                        aria-expanded={false}
                                                    />
                                                </CardOptions>
                                            </CardHead>
                                            <div
                                                className="collapse"
                                                id={"collapse2" + i + (list && list.id)}
                                            >
                                                <CardBody>
                                                    <div className='w-100' ref={(el) => editorRef.current[i] = el}>
                                                        <SunEditor
                                                            lang="pt_br"
                                                            height="auto"
                                                            disable={true}
                                                            showToolbar={false}
                                                            // onChange={handleDescriptionChange.bind(this)}
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
                                                            <Link to={`/aluno/turma/${props.match.params.idClass}/lista/${list.id}/exercicio/${question.id}`}>
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
                                                                <Link to={`/professor/turma/${props.match.params.idClass}/participantes/${props.match.params.idUser}/listas/${list && list.id}/exercicio/${question.id}`}>
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
                                                                        <Link to={`/professor/turma/${props.match.params.idClass}/lista/${list.id}/exercicio/${question.id}`}>
                                                                            <button
                                                                                className="btn btn-success mr-2"
                                                                                style={{ float: "right" }}
                                                                            >
                                                                                Acessar <i className="fa fa-wpexplorer" />
                                                                            </button>
                                                                        </Link>
                                                                        {question.type === 'PROGRAMAÇÃO' &&
                                                                            <>
                                                                                <span style={{ cursor: 'pointer' }} className="card-dropdown h-100" data-toggle="dropdown" aria-expanded="false">
                                                                                    <BsThreeDotsVertical size={25} />
                                                                                </span>

                                                                                <div className="dropdown-menu dropdown-menu-demo">
                                                                                    <Link className="dropdown-item" to={`/professor/turma/${props.match.params.idClass}/lista/${list.id}/exercicio/${question.id}/submissoes`}>
                                                                                        Ver última submissão dos alunos
                                                                                    </Link>
                                                                                    <Link className="dropdown-item" to={`/professor/turma/${props.match.params.idClass}/lista/${list.id}/exercicio/${question.id}/submissoes/plagio`}>
                                                                                        Verificar Plágios
                                                                                    </Link>
                                                                                </div>
                                                                            </>
                                                                        }
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
            <Dialog
                open={showDateModal}
                maxWidth={'lg'}
                onClose={() => setShowDateModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
            >

                <DialogTitle id="contained-modal-title-vcenter">
                    {`Adicionar data limite para as submissões da lista '${list.title}'`}
                </DialogTitle>
                <DialogContent>
                    <Row>
                        <Col className='col-12 text-center'>
                            <input
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                            />{" "}
                    -{" "}
                            <input
                                type="time"
                                value={timeInput}
                                onChange={(e) => setTimeInput(e.target.value)}
                            />
                        </Col>
                    </Row>
                </DialogContent>
                <DialogActions>
                    <button
                        className={`btn btn-primary ${'' && "btn-loading"}`}
                        onClick={handleAddSubmissionDeadline}
                    >
                        Adicionar
                    </button>
                    <button
                        className={`btn btn-outline-primary  ${'' && "btn-loading"}`}
                        onClick={() => {
                            setShowDateModal(false);
                            setDateInput('');
                            setTimeInput('');
                        }
                        }
                    >
                        Depois
                    </button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ClassListSubscreen;