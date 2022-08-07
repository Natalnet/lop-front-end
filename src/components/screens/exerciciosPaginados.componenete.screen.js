import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Link } from "react-router-dom";
import { Pagination } from "../ui/navs";
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '../ui/tabs/Tab';
import TabPanel from '../ui/tabs/TabPanel'
import Paper from '@material-ui/core/Paper';
import { getStateFormQuestionsFromStorage } from "../../util/auxiliaryFunctions.util";
import moment from "moment";
import FormFilterQuestion from '../ui/forms/formFilterQuestions'
import "katex/dist/katex.min.css";
import { Load } from '../ui/load';
import { BlockMath } from "react-katex";
import TableIO from "../ui/tables/tableIO.component";
//import { Card, CardBody, CardFooter, CardHead, CardTitle, CardOptions } from '../ui/card';
import { Row, Col } from '../ui/grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useQuestion from '../../hooks/useQuestion';
import useObjectveQuestion from '../../hooks/useObjectveQuestion';
import useDiscursiveQuestion from '../../hooks/useDiscursiveQuestion';
import usePagination from '../../hooks/usePagination';
import useTag from '../../hooks/useTag';
import { FaCheck } from 'react-icons/fa';
//import { BiCodeAlt } from 'react-icons/bi';

const QuestionsSubscreen = props => {

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);
    const email = useMemo(() => sessionStorage.getItem("user.email").toLowerCase(), []);
    const arrDifficulty = useMemo(() =>
        [null, "Muito fácil", "Fácil", "Médio", "Difícil", "Muito Difícil"]
        , []);

    const [showModal, setShowModal] = useState(false);

    //question hook
    const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();

    //objetiveQuestion hook
    const {
        isLoadingObjectiveQuestions,
        isLoadingInfoObjectiveQuestion,
        paginedObjectiveQuestions,
        infoObjectiveQuestion,
        getInfoObjectiveQuestion,
        getPaginedObjectiveQuestions,
        setInfoObjectiveQuestion
    } = useObjectveQuestion();

    //discursiveQuestion hook
    const {
        isLoadingDiscursiveQuestions,
        isLoadingInfoDiscursiveQuestion,
        paginedDiscursiveQuestions,
        infoDiscursiveQuestion,
        getInfoDiscursiveQuestion,
        getPaginedDiscursiveQuestions,
        setInfoDiscursiveQuestion
    } = useDiscursiveQuestion();

    //tag hook
    const { tags, isLoadingTags, getTags } = useTag();

    //pagination hook
    const {
        page,
        docsPerPage,
        totalPages,
        setDocsPerPage,
        setPage,
        setTotalPages,
        setTotalDocs
    } = usePagination(
        getStateFormQuestionsFromStorage("pageQuestions"),
        getStateFormQuestionsFromStorage("docsPerPageQuestions")
    );
    const editorRef = useRef([]);

    //pagination hook
    const {
        page: pageObjectiveQuestion,
        //docsPerPage: docsPerPageObjectiveQuestion,
        totalPages: totalPagesObjectiveQuestion,
        setDocsPerPage: setDocsPerPageObjectiveQuestion,
        setPage: setPageObjectiveQuestion,
        setTotalPages: setTotalPageObjectiveQuestion,
        setTotalDocs: setTotalDocsObjectiveQuestion
    } = usePagination(1, 15);

    //pagination hook
    const {
        page: pageDiscursiveQuestion,
        //docsPerPage: docsPerPageDiscursiveQuestion,
        totalPages: totalPagesDiscursiveQuestion,
        setDocsPerPage: setDocsPerPageDiscursiveQuestion,
        setPage: setPageDiscursiveQuestion,
        setTotalPages: setTotalPageDiscursiveQuestion,
        setTotalDocs: setTotalDocsDiscursiveQuestion
    } = usePagination(1, 15);

    const [tabIndex, setTabIndex] = useState(() => {
        const state = props.location.state;
        if (state && state.tab) {
            return state.tab;
        }
        return 0;
    });

    const [openObjectiveQuestionModal, setOpenObjectiveQuestionModal] = useState(false);
    const [openDiscursiveQuestionModal, setOpenDiscursiveQuestionModal] = useState(false);

    const [titleOrCodeInput, setTitleOrCodeInput] = useState(getStateFormQuestionsFromStorage("titleOrCodeInputQuestions"));
    const [sortBySelect, setSortBySelect] = useState(getStateFormQuestionsFromStorage("sortBySelectQuestions"));
    const [sortRadio, setSortRadio] = useState(getStateFormQuestionsFromStorage("sortRadioQuestions"));
    const [ascRadio, setAscRadio] = useState(getStateFormQuestionsFromStorage("radioAscQuestions"));
    const [descRadio, setDescRadio] = useState(getStateFormQuestionsFromStorage("radioDescQuestions"));
    const [tagSelect, setTagSelect] = useState(getStateFormQuestionsFromStorage("tagSelectQuestion"));

    const [filteredTitleOrCodeInput, setFilteredTitleOrCodeInput] = useState(getStateFormQuestionsFromStorage("titleOrCodeInputQuestions"));
    const [filteredSortBySelect, setFilteredSortBySelect] = useState(getStateFormQuestionsFromStorage("sortBySelectQuestions"));
    const [filteredDocsPerPage, setFilteredDocsPerPage] = useState(getStateFormQuestionsFromStorage("docsPerPageQuestions"));
    const [filteredSortRadio, setFilteredSortRadio] = useState(getStateFormQuestionsFromStorage("sortRadioQuestions"));
    const [filteredTagSelect, setFilteredTagSelect] = useState(getStateFormQuestionsFromStorage("tagSelectQuestion"));

    const [selectedQuestionToShowInModal, setSelectedQuestionToShowInModal] = useState(null);

    useEffect(() => {
        getTags();
        switch (tabIndex) {
            case 0:
                getPaginedQuestions(page, getFilteredQuerys());
                sessionStorage.setItem("pageQuestions", page);
                break;
            case 1:
                getPaginedObjectiveQuestions(pageObjectiveQuestion, '')
                break;
            case 2:
                getPaginedDiscursiveQuestions(pageDiscursiveQuestion, '')
                break;

            default:
                break;
        }
        //divRef.current.classList('sun-editor-wrap');
    }, []);

    const isTeacher = useCallback(() => {
        return profile === 'professor'
    }, [profile])

    const isAuthor = useCallback((author) => {
        return email === author.email && isTeacher()
    }, [email, isTeacher])

    const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

    const getFilteredQuerys = useCallback(() => {
        const query = {
            titleOrCode: filteredTitleOrCodeInput.trim(),
            docsPerPage: filteredDocsPerPage,
            sortBy: filteredSortBySelect,
            sort: filteredSortRadio,
            tag: filteredTagSelect || '',
        };
        if (isTeacher()) {
            query.status = 'PÚBLICA PRIVADA';
        }
        return query;
    }, [filteredTitleOrCodeInput, filteredSortBySelect, filteredSortRadio, filteredTagSelect, filteredDocsPerPage, isTeacher]);

    const getQuerys = useCallback(() => {
        const query = {
            titleOrCode: titleOrCodeInput.trim(),
            docsPerPage: docsPerPage,
            sortBy: sortBySelect,
            sort: sortRadio,
            tag: tagSelect || '',
        };
        if (isTeacher()) {
            query.status = 'PÚBLICA PRIVADA';
        }
        return query;
    }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage, isTeacher]);

    const saveQuerysInStorage = useCallback(() => {
        setFilteredTitleOrCodeInput(() => titleOrCodeInput);
        setFilteredSortBySelect(() => sortBySelect);
        setFilteredDocsPerPage(() => docsPerPage);
        setFilteredSortRadio(() => sortRadio);
        setFilteredTagSelect(() => tagSelect);
        sessionStorage.setItem("titleOrCodeInputQuestions", titleOrCodeInput);
        sessionStorage.setItem("sortBySelectQuestions", sortBySelect);
        sessionStorage.setItem("sortRadioQuestions", sortRadio);
        sessionStorage.setItem("tagSelectQuestion", tagSelect);
        sessionStorage.setItem(
            "radioAscQuestions",
            sortRadio === "ASC" ? true : false
        );
        sessionStorage.setItem(
            "radioDescQuestions",
            sortRadio === "DESC" ? true : false
        );
        sessionStorage.setItem("docsPerPageQuestions", docsPerPage);
    }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage]);

    const handleSortRadio = useCallback(e => {
        setAscRadio(e.target.value === "ASC" ? true : false);
        setDescRadio(e.target.value === "DESC" ? true : false);
        setSortRadio(e.target.value)
    }, []);

    const handlleFilter = useCallback(() => {
        getPaginedQuestions(page, getQuerys());
        saveQuerysInStorage();
    }, [page, getPaginedQuestions, saveQuerysInStorage, getQuerys]);

    const handlePage = useCallback((e, numPage) => {
        e.preventDefault();
        setPage(numPage);
        getPaginedQuestions(numPage, getQuerys());
        sessionStorage.setItem('pageQuestions', numPage);
    }, [getQuerys, getPaginedQuestions, setPage]);

    const handlePageObjectiveQuestions = useCallback((e, numPage) => {
        e.preventDefault();
        setPageObjectiveQuestion(numPage);
        getPaginedObjectiveQuestions(numPage, '');
    }, [getPaginedObjectiveQuestions, setPageObjectiveQuestion]);

    const handlePageDiscursiveQuestions = useCallback((e, numPage) => {
        e.preventDefault();
        setPageObjectiveQuestion(numPage);
        getPaginedDiscursiveQuestions(numPage, '');
    }, [getPaginedDiscursiveQuestions, setPageDiscursiveQuestion]);

    const handleShowObjectiveQuestionModal = useCallback((question => {
        getInfoObjectiveQuestion(question.id);
        setOpenObjectiveQuestionModal(true);
    }), [getInfoObjectiveQuestion, setOpenObjectiveQuestionModal]);

    const handleShowDiscursiveQuestionModal = useCallback((question => {
        getInfoDiscursiveQuestion(question.id);
        setOpenDiscursiveQuestionModal(true);
    }), [getInfoDiscursiveQuestion, setOpenDiscursiveQuestionModal]);

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedQuestions) {
            setPage(paginedQuestions.currentPage);
            setTotalDocs(paginedQuestions.total);
            setDocsPerPage(paginedQuestions.perPage);
            setTotalPages(paginedQuestions.totalPages);
        }
    }, [paginedQuestions, setPage, setTotalDocs, setDocsPerPage, setTotalPages]);

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedObjectiveQuestions) {
            setPageObjectiveQuestion(paginedObjectiveQuestions.currentPage);
            setTotalDocsObjectiveQuestion(paginedObjectiveQuestions.total);
            setDocsPerPageObjectiveQuestion(paginedObjectiveQuestions.perPage);
            setTotalPageObjectiveQuestion(paginedObjectiveQuestions.totalPages);
        }
    }, [paginedObjectiveQuestions, setPageObjectiveQuestion, setTotalDocsObjectiveQuestion, setDocsPerPageObjectiveQuestion, setTotalPageObjectiveQuestion]);

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedDiscursiveQuestions) {
            setPageDiscursiveQuestion(paginedDiscursiveQuestions.currentPage);
            setTotalDocsDiscursiveQuestion(paginedDiscursiveQuestions.total);
            setDocsPerPageDiscursiveQuestion(paginedDiscursiveQuestions.perPage);
            setTotalPageDiscursiveQuestion(paginedDiscursiveQuestions.totalPages);
        }
    }, [paginedDiscursiveQuestions, setPageDiscursiveQuestion, setTotalDocsDiscursiveQuestion, setDocsPerPageDiscursiveQuestion, setTotalPageDiscursiveQuestion]);

    const handleShowModal = useCallback(q => {
        setSelectedQuestionToShowInModal(q);
        setShowModal(true);
    }, []);

    const handleTabeIndex = useCallback((e, newValue) => {
        setTabIndex(newValue);
        switch (newValue) {
            case 0:
                getPaginedQuestions(page, getQuerys());
                break;
            case 1:
                getPaginedObjectiveQuestions(pageObjectiveQuestion, '');
                break;
            case 2:
                getPaginedDiscursiveQuestions(pageDiscursiveQuestion, '');
                break;
            default:
                break;
        }
    }, [page, pageObjectiveQuestion, getPaginedQuestions, getPaginedObjectiveQuestions, getPaginedDiscursiveQuestions, getQuerys]);

    if (isLoadingTags || !tags.length) {
        return <Load />;
    }

    return (
        <>
            {isTeacher() &&
                <Paper>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabeIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab
                            label='Programação'
                            // icon={<BiCodeAlt />}
                            id='scrollable-force-tab-0'
                            aria-controls='scrollable-force-tabpanel-0'
                        />
                        <Tab
                            label='Objetivas'
                            // icon={<BiCodeAlt />}
                            id='scrollable-force-tab-1'
                            aria-controls='scrollable-force-tabpanel-1'
                        />
                        <Tab
                            label='Discursivas'
                            // icon={<BiCodeAlt />}
                            id='scrollable-force-tab-2'
                            aria-controls='scrollable-force-tabpanel-2'
                        />
                    </Tabs>
                </Paper>
            }
            <TabPanel value={tabIndex} index={0}>
                {isTeacher() && (
                    <Row className='mb-4'>
                        <Col className='col-12'>
                            <Link to="/professor/criarExercicio">
                                <button className="btn btn-primary">Criar Exercício</button>
                            </Link>
                        </Col>
                    </Row>
                )}
                <FormFilterQuestion
                    titleOrCodeInput={titleOrCodeInput}
                    ascRadio={ascRadio}
                    descRadio={descRadio}
                    docsPerPage={docsPerPage}
                    tagSelect={tagSelect}
                    tagsSelect={tagsSelect}
                    sortBySelect={sortBySelect}
                    loading={isLoadingQuestions}
                    handlleFilter={handlleFilter}
                    handleSortBySelect={(e) => setSortBySelect(e.target.value)}
                    handleTitleOrCodeInput={(e) => setTitleOrCodeInput(e.target.value)}
                    handleDocsPerPage={(e) => setDocsPerPage(e.target.value)}
                    handleTagSelect={(e) => setTagSelect(e.target.value)}
                    handleSortRadio={handleSortRadio}
                />

                <Row className='mb-4'>
                    <Col className='col-12'>
                        <Load className={`${!(isLoadingQuestions) ? 'd-none' : ''}`} />
                        <table className={`table table-hover table-responsive-md ${isLoadingQuestions ? 'd-none' : ''}`}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>N° de acessos</th>
                                    <th>N° de Submissões corretas</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!paginedQuestions ? [] : paginedQuestions.docs.map((question) => (
                                    <tr key={question.id}>
                                        <td>
                                            {/*question.isCorrect ? (
                                                <i
                                                    className="fa fa-check"
                                                    style={{ color: "#0f0" }}
                                                />
                                            ) : question.wasTried ? (
                                                <i
                                                    className="fa fa-remove"
                                                    style={{ color: "#f00" }}
                                                />
                                            ) : <>&nbsp;</>*/}
                                        </td>
                                        <td> {question.title}</td>
                                        <td>{question.code}</td>
                                        <td>{question.accessCount}</td>
                                        <td>{arrDifficulty[parseInt(question.difficulty)]}</td>

                                        <td className="d-inline-flex">

                                            <Link to={`/${profile}/exercicio/${question.id}`} >
                                                <button className="btn btn-success mr-2" title="Acessar Exercício">
                                                    Acessar <i className="fa fa-wpexplorer" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-primary mr-2" title="Ver informações" onClick={() => handleShowModal(question)}>
                                                <i className="fa fa-info" />
                                            </button>
                                            {isAuthor(question.author) && (
                                                <Link to={`/professor/exercicios/${question.id}/editar`}>
                                                    <button className='btn btn-info mr-2' title="Editar Exercício">
                                                        <i className="fe fe-edit" />
                                                    </button>
                                                </Link>
                                            )}
                                            {isTeacher() && (
                                                <Link to={`/professor/criarExercicio?idQuestion=${question.id}`} >
                                                    <button className="btn btn-warning mr-2" title="Clonar Exercício">
                                                        <i className="fa fa-copy" />
                                                    </button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col className='col-12 text-center'>
                        <Pagination
                            count={totalPages}
                            page={Number(page)}
                            onChange={handlePage}
                            color="primary"
                            size="large"
                            disabled={isLoadingQuestions}
                        />
                    </Col>
                </Row>
            </TabPanel>
            {isTeacher() &&
                <>
                    <TabPanel value={tabIndex} index={1}>
                        {isTeacher() && (
                            <Row className='mb-4'>
                                <Col className='col-12'>
                                    <Link to="/professor/criarExercicioObjetvo">
                                        <button className="btn btn-primary">Criar Exercício</button>
                                    </Link>
                                </Col>
                            </Row>
                        )}
                        <Row className='mb-4'>
                            <Col className='col-12'>
                                <Load className={`${!(isLoadingObjectiveQuestions) ? 'd-none' : ''}`} />
                                <table className={`table table-hover ${isLoadingObjectiveQuestions ? 'd-none' : ''}`}>
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Código</th>
                                            <th>Dificuldade</th>
                                            <th>Criado em</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!paginedObjectiveQuestions ? [] : paginedObjectiveQuestions.docs.map((question) => (
                                            <tr key={question.id}>
                                                <td>{question.title}</td>
                                                <td>{question.code}</td>
                                                <td>{arrDifficulty[parseInt(question.difficulty)]}</td>
                                                <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                <td>
                                                    <button className="btn btn-primary mr-2" title="Ver informações" onClick={() => handleShowObjectiveQuestionModal(question)}>
                                                        <i className="fa fa-info" />
                                                    </button>
                                                    {
                                                        isAuthor(question.author) && (
                                                            <Link to={`/professor/editarExercicioObjetvo/${question.id}`}>
                                                                <button className='btn btn-info mr-2' title="Editar Exercício">
                                                                    <i className="fe fe-edit" />
                                                                </button>
                                                            </Link>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-12 text-center'>
                                <Pagination
                                    count={totalPagesObjectiveQuestion}
                                    page={Number(pageObjectiveQuestion)}
                                    onChange={handlePageObjectiveQuestions}
                                    color="primary"
                                    size="large"
                                    disabled={isLoadingObjectiveQuestions}
                                />
                            </Col>
                        </Row>
                    </TabPanel>

                    <TabPanel value={tabIndex} index={2}>
                        {isTeacher() && (
                            <>
                                <Row className='mb-4'>
                                    <Col className='col-12'>
                                        <Link to="/professor/criarExercicioDiscursivo">
                                            <button className="btn btn-primary">Criar Exercício</button>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row className='mb-4'>
                                    <Col className='col-12'>
                                        <Load className={`${!(isLoadingDiscursiveQuestions) ? 'd-none' : ''}`} />
                                        <table className={`table table-hover ${isLoadingDiscursiveQuestions ? 'd-none' : ''}`}>
                                            <thead>
                                                <tr>
                                                    <th>Título</th>
                                                    <th>Código</th>
                                                    <th>Dificuldade</th>
                                                    <th>Criado em</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {!paginedDiscursiveQuestions ? [] : paginedDiscursiveQuestions.docs.map((question) => (
                                                    <tr key={question.id}>
                                                        <td>{question.title}</td>
                                                        <td>{question.code}</td>
                                                        <td>{arrDifficulty[parseInt(question.difficulty)]}</td>
                                                        <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                        <td>
                                                            <button className="btn btn-primary mr-2" title="Ver informações" onClick={() => handleShowDiscursiveQuestionModal(question)}>
                                                                <i className="fa fa-info" />
                                                            </button>
                                                            {
                                                                isAuthor(question.author) && (
                                                                    <Link to={`/professor/editarExercicioDiscursivo/${question.id}`}>
                                                                        <button className='btn btn-info mr-2' title="Editar Exercício">
                                                                            <i className="fe fe-edit" />
                                                                        </button>
                                                                    </Link>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='col-12 text-center'>
                                        <Pagination
                                            count={totalPagesDiscursiveQuestion}
                                            page={Number(pageDiscursiveQuestion)}
                                            onChange={handlePageDiscursiveQuestions}
                                            color="primary"
                                            size="large"
                                            disabled={isLoadingDiscursiveQuestions}
                                        />
                                    </Col>
                                </Row>
                            </>
                        )}
                    </TabPanel>
                </>
            }
            <Dialog
                open={showModal}
                maxWidth={'md'}
                onClose={() => setShowModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <DialogTitle id="contained-modal-title-vcenter">
                    {selectedQuestionToShowInModal && selectedQuestionToShowInModal.title}
                </DialogTitle>
                <DialogContent>
                    <Row className='mb-2'>
                        <Col className='col-12'>
                            <b>Descrição: </b>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='col-12'>

                            <div className='w-100' ref={(el) => editorRef.current[0] = el}>
                                {selectedQuestionToShowInModal && <SunEditor
                                    lang="pt_br"
                                    height="auto"
                                    width='100%'
                                    disable={true}
                                    showToolbar={false}
                                    // onChange={this.handleDescriptionChange.bind(this)}
                                    setContents={selectedQuestionToShowInModal.description}
                                    setDefaultStyle="font-size: 15px; text-align: justify"
                                    onLoad={() => {
                                        editorRef.current[0].classList.add('sun-editor-wrap')
                                    }}
                                    setOptions={{
                                        toolbarContainer: '#toolbar_container',
                                        resizingBar: false,
                                        katex: katex,
                                    }}
                                />}
                            </div>
                        </Col>
                    </Row>
                    {selectedQuestionToShowInModal && selectedQuestionToShowInModal.katexDescription &&
                        <Row>
                            <Col className='col-12' textCenter>
                                <BlockMath>
                                    {selectedQuestionToShowInModal.katexDescription}
                                </BlockMath>
                            </Col>
                        </Row>
                    }
                    {isTeacher() &&
                        <Row>
                            <Col className='col-12'>
                                <TableIO results={(selectedQuestionToShowInModal && selectedQuestionToShowInModal.results) || []} />
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col className='col-12 mb-2'>
                            <b>Autor(a):</b> {selectedQuestionToShowInModal && selectedQuestionToShowInModal.author.email}
                        </Col>
                        {selectedQuestionToShowInModal && selectedQuestionToShowInModal.tags && !!selectedQuestionToShowInModal.tags.length &&
                            <Col className='col-12 mb-2'>
                                <b>Tags: </b> {selectedQuestionToShowInModal && selectedQuestionToShowInModal.tags.join(", ")}
                            </Col>
                        }
                        <Col className='col-12'>
                            <b>Data de criação:</b>{" "}
                            {selectedQuestionToShowInModal && moment(selectedQuestionToShowInModal.createdAt).local().format('DD/MM/YYYY - HH:mm')}
                        </Col>
                    </Row>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openObjectiveQuestionModal}
                maxWidth={'md'}
                onClose={() => {
                    setOpenObjectiveQuestionModal(false);
                    setInfoObjectiveQuestion(null);
                }}
                aria-labelledby="contained-modal-title-vcenter"
            >
                {(isLoadingInfoObjectiveQuestion || !infoObjectiveQuestion) ?
                    <Load />
                    :
                    <>
                        <DialogTitle id="contained-modal-title-vcenter">
                            {infoObjectiveQuestion.title}
                        </DialogTitle>
                        <DialogContent>
                            <Row>
                                <Col className='col-12 mb-4'>
                                    <div ref={(el) => editorRef.current[0] = el} className='w-100'>
                                        <SunEditor
                                            lang="pt_br"
                                            height="auto"
                                            width='100%'
                                            disable={true}
                                            showToolbar={false}
                                            setContents={infoObjectiveQuestion.description}
                                            setDefaultStyle="font-size: 15px; text-align: justify"
                                            onLoad={() => {
                                                editorRef.current[0].classList.add('sun-editor-wrap')
                                            }}
                                            setOptions={{
                                                toolbarContainer: '#toolbar_container',
                                                resizingBar: false,
                                                katex: katex,
                                            }}
                                        />
                                    </div>

                                </Col>
                                {infoObjectiveQuestion.alternatives.map((alternative, i) => (

                                    <Col className='col-12 mb-2' key={i}>
                                        <Row className='border-0'>
                                            <Col className='col-1 pr-0'>
                                                {alternative.isCorrect && <FaCheck size={15} color='#5eba00' />}
                                            </Col>
                                            <Col className='col-1 pr-0'>
                                                {`${String.fromCharCode(65 + i)})`}
                                            </Col>
                                            <Col className='col-10'>
                                                <div ref={(el) => editorRef.current[i + 1] = el} className='w-100'>
                                                    <SunEditor
                                                        lang="pt_br"
                                                        height="auto"
                                                        border='0'
                                                        width='100%'
                                                        disable={true}
                                                        showToolbar={false}
                                                        setContents={alternative.description}
                                                        setDefaultStyle="font-size: 15px; text-align: justify; border: 0;"
                                                        onLoad={() => {
                                                            editorRef.current[i + 1].classList.add('sun-editor-wrap')
                                                        }}
                                                        setOptions={{
                                                            toolbarContainer: '#toolbar_container',
                                                            resizingBar: false,
                                                            katex: katex,
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                ))}
                            </Row>
                        </DialogContent>
                        <DialogActions>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    setOpenObjectiveQuestionModal(false);
                                    setInfoObjectiveQuestion(null);
                                }}
                            >
                                Fechar
                        </button>
                        </DialogActions>
                    </>
                }
            </Dialog>

            <Dialog
                open={openDiscursiveQuestionModal}
                maxWidth={'md'}
                onClose={() => {
                    setOpenDiscursiveQuestionModal(false);
                    setInfoDiscursiveQuestion(null);
                }}
                aria-labelledby="contained-modal-title-vcenter"
            >
                {(isLoadingInfoDiscursiveQuestion || !infoDiscursiveQuestion) ?
                    <Load />
                    :
                    <>
                        <DialogTitle id="contained-modal-title-vcenter">
                            {infoDiscursiveQuestion.title}
                        </DialogTitle>
                        <DialogContent>
                            <Row>
                                <Col className='col-12 mb-4'>
                                    <div ref={(el) => editorRef.current[0] = el} className='w-100'>
                                        <SunEditor
                                            lang="pt_br"
                                            height="auto"
                                            width='100%'
                                            disable={true}
                                            showToolbar={false}
                                            setContents={infoDiscursiveQuestion.description}
                                            setDefaultStyle="font-size: 15px; text-align: justify"
                                            onLoad={() => {
                                                editorRef.current[0].classList.add('sun-editor-wrap')
                                            }}
                                            setOptions={{
                                                toolbarContainer: '#toolbar_container',
                                                resizingBar: false,
                                                katex: katex,
                                            }}
                                        />
                                    </div>

                                </Col>
                            </Row>
                        </DialogContent>
                        <DialogActions>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    setOpenDiscursiveQuestionModal(false);
                                    setInfoDiscursiveQuestion(null);
                                }}
                            >
                                Fechar
                        </button>
                        </DialogActions>
                    </>
                }
            </Dialog>

        </>
    )
}
export default QuestionsSubscreen;
