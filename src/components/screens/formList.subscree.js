import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link, useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import api from "../../services/api";
import { Load } from '../ui/load';
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '../ui/tabs/Tab';
import TabPanel from '../ui/tabs/TabPanel';
import Paper from '@material-ui/core/Paper';
import useQuestion from '../../hooks/useQuestion';
import usePagination from '../../hooks/usePagination';
import useList from '../../hooks/useList';
import useTag from '../../hooks/useTag';
import useObjectveQuestion from '../../hooks/useObjectveQuestion';
import useDiscursiveQuestion from '../../hooks/useDiscursiveQuestion';
import { Pagination } from "../ui/navs";
import FormFilterQuestion from '../ui/forms/formFilterQuestions';
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from "../ui/tables/tableIO.component";
import { Row, Col } from '../ui/grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Card, CardBody } from '../ui/card';
import { FaCheck } from 'react-icons/fa';

const FormListSubscreen = props => {
    const arrDifficulty = useMemo(() =>
        [null, "Muito fácil", "Fácil", "Médio", "Difícil", "Muito Difícil"]
        , []);

    const { tags, isLoadingTags, getTags } = useTag();
    const { createList, updateList } = useList();
    const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
    const {
        isLoadingObjectiveQuestions,
        isLoadingInfoObjectiveQuestion,
        paginedObjectiveQuestions,
        infoObjectiveQuestion,
        getInfoObjectiveQuestion,
        getPaginedObjectiveQuestions,
        setInfoObjectiveQuestion
    } = useObjectveQuestion();

    const {
        isLoadingDiscursiveQuestions,
        isLoadingInfoDiscursiveQuestion,
        paginedDiscursiveQuestions,
        infoDiscursiveQuestion,
        getInfoDiscursiveQuestion,
        getPaginedDiscursiveQuestions,
        setInfoDiscursiveQuestion
    } = useDiscursiveQuestion();

    const {
        page,
        totalPages,
        docsPerPage,
        setDocsPerPage,
        setPage,
        setTotalPages,
        setTotalDocs
    } = usePagination();
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

    const {
        page: pageDiscursiveQuestion,
        //docsPerPage: docsPerPageDiscursiveQuestion,
        totalPages: totalPagesDiscursiveQuestion,
        setDocsPerPage: setDocsPerPageDiscursiveQuestion,
        setPage: setPageDiscursiveQuestion,
        setTotalPages: setTotalPageDiscursiveQuestion,
        setTotalDocs: setTotalDocsDiscursiveQuestion
    } = usePagination(1, 15);

    const [tabIndex, setTabIndex] = useState(0);

    const [title, setTitle] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [modalQuestion, setModalQuestion] = useState(null);
    const [isLoadingQuestionsByList, setIsLoadingQuestionsByList] = useState(false)

    const [titleOrCodeInput, setTitleOrCodeInput] = useState('');
    const [sortBySelect, setSortBySelect] = useState('createdAt');
    const [sortRadio, setSortRadio] = useState('DESC');
    const [ascRadio, setAscRadio] = useState(false);
    const [descRadio, setDescRadio] = useState(true);
    const [tagSelect, setTagSelect] = useState('');
    const [openObjectiveQuestionModal, setOpenObjectiveQuestionModal] = useState(false);
    const [openDiscursiveQuestionModal, setOpenDiscursiveQuestionModal] = useState(false);

    const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

    const history = useHistory();
    const location = useLocation();
    const editorRef = useRef([]);

    const getQuerys = useCallback(() => {
        const query = {
            titleOrCode: titleOrCodeInput.trim(),
            docsPerPage: docsPerPage,
            sortBy: sortBySelect,
            sort: sortRadio,
            tag: tagSelect || '',
            status: 'PÚBLICA PRIVADA'
        };
        return query;
    }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage]);

    useEffect(() => {
        getTags();
        switch (tabIndex) {
            case 0:
                getPaginedQuestions(page, {});
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
        const { idList } = props.match.params;
        const { search } = location;
        if (idList) {
            document.title = 'Editar lista - professor';
            getQuestionsByList(idList);
        }
        else if (search.includes('?idList=')) {
            document.title = 'Clonar lista - professor';
            const id = search.replace('?idList=', '')
            getQuestionsByList(id);
        }
        else {
            document.title = 'Criar lista - professor';
        }
    }, []);

    const handlePage = useCallback((e, numPage) => {
        e.preventDefault();
        setPage(numPage);
        getPaginedQuestions(numPage, getQuerys());
    }, [setPage, getPaginedQuestions, getQuerys]);

    const handlePageObjectiveQuestions = useCallback((e, numPage) => {
        e.preventDefault();
        setPageObjectiveQuestion(numPage);
        getPaginedObjectiveQuestions(numPage, '');
    }, [getPaginedObjectiveQuestions, setPageObjectiveQuestion]);

    const handlePageDiscursiveQuestions = useCallback((e, numPage) => {
        e.preventDefault();
        setPageDiscursiveQuestion(numPage);
        getPaginedDiscursiveQuestions(numPage, '');
    }, [setPageDiscursiveQuestion, getPaginedDiscursiveQuestions]);

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
            setTotalPages(paginedQuestions.totalPages)
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

    const getQuestionsByList = useCallback(async (id) => {
        let query = `idList=${id}`;
        setIsLoadingQuestionsByList(true);
        try {
            const response = await api.get(`/question?${query}`);
            setTitle(response.data.list.title);
            setSelectedQuestions(response.data.questions)
        } catch (err) {
            console.log(err);
        }
        setIsLoadingQuestionsByList(false);
    }, [])

    const handleCreateList = useCallback(async e => {
        e.preventDefault();
        const isCreated = await createList({ title, selectedQuestions })
        if (isCreated) {
            history.push("/professor/listas");
        }
    }, [title, selectedQuestions, history, createList]);

    const handleUpdateList = useCallback(async (e) => {
        e.preventDefault();
        const { idList } = props.match.params;
        const isUpdated = await updateList(idList, { title, selectedQuestions });
        if (isUpdated) {
            history.push("/professor/listas");
        }
    }, [props, title, selectedQuestions, history, updateList]);

    const saveQuerys = useCallback(() => {

    }, [/*titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage*/]);

    const addQuestion = useCallback(selectedQuestion => {
        setSelectedQuestions(oldSelectedQuestions => [...oldSelectedQuestions, selectedQuestion])
    }, [])

    const removeQuestion = useCallback(removedQuestion => {
        setSelectedQuestions(oldSelectedQuestions => oldSelectedQuestions.filter(q =>
            q.id !== removedQuestion.id
        ))
    }, [])

    const handleShowModalInfo = useCallback(question => {
        setModalQuestion(question);
        setShowModalInfo(true)
    }, []);

    const handleSortRadio = useCallback(e => {
        setAscRadio(e.target.value === "ASC" ? true : false);
        setDescRadio(e.target.value === "DESC" ? true : false);
        setSortRadio(e.target.value)
    }, []);

    const handlleFilter = useCallback(() => {
        getPaginedQuestions(page, getQuerys());
    }, [page, getQuerys, getPaginedQuestions]);

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
    }, [page, pageObjectiveQuestion, pageDiscursiveQuestion, getPaginedQuestions, getPaginedObjectiveQuestions, getPaginedDiscursiveQuestions, getQuerys]);

    if (isLoadingTags || isLoadingQuestionsByList) {
        return <Load />
    }
    return (
        <>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <h5 style={{ margin: "0px" }}>
                        <Link to="/professor/listas">Listas</Link>
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        {
                            props.match.params.idList && title ?
                                <>
                                    {title}
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                    Editar lista
                                </>
                                :
                                'Criar lista'
                        }

                    </h5>
                </Col>
            </Row>


            <Card>
                <CardBody>
                    <form
                        onSubmit={(e) => {
                            props.match.params.idList ?
                                handleUpdateList(e)
                                :
                                handleCreateList(e)
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}>
                        <Row className='mb-4'>
                            <Col className="col-12">
                                <label htmlFor="inputTitulo">Título da lista</label>
                                <input
                                    id="inputTitulo"
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                    placeholder="Título da lista"
                                />
                            </Col>
                        </Row>
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
         
                        <TabPanel
                            className='mt-4'
                            value={tabIndex}
                            index={0}
                        >

                            <FormFilterQuestion
                                titleOrCodeInput={titleOrCodeInput}
                                ascRadio={ascRadio}
                                descRadio={descRadio}
                                docsPerPage={docsPerPage}
                                tagSelect={tagSelect}
                                tagsSelect={tagsSelect}
                                sortBySelect={sortBySelect}
                                loading={isLoadingQuestions || isLoadingTags}
                                handlleFilter={handlleFilter}
                                handleSortBySelect={(e) => setSortBySelect(e.target.value)}
                                handleTitleOrCodeInput={(e) => setTitleOrCodeInput(e.target.value)}
                                handleDocsPerPage={(e) => setDocsPerPage(e.target.value)}
                                handleTagSelect={(e) => setTagSelect(e.target.value)}
                                handleSortRadio={handleSortRadio}
                            />

                            <Row className='mb-4'>
                                <Col className="col-12">
                                    <Load className={`${!(isLoadingQuestions) ? 'd-none' : ''}`} />

                                    <table
                                        className={`table table-hover table-responsive-md mb-0 ${isLoadingQuestions ? 'd-none' : ''}`}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Código</th>
                                                <th>Autor(a)</th>
                                                <th>Criado em</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!paginedQuestions ? [] : paginedQuestions.docs.map((question) => {
                                                return (
                                                    <tr key={question.id}>
                                                        <td>{question.title}</td>
                                                        <td>{question.code}</td>
                                                        <td>{question.author.email}</td>
                                                        <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                        <td className="d-inline-flex">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary mr-2"
                                                                onClick={() =>
                                                                    handleShowModalInfo(question)
                                                                }
                                                            >
                                                                <i className="fa fa-info" />
                                                            </button>
                                                            {selectedQuestions
                                                                .map((s) => s.id)
                                                                .includes(question.id) ? (
                                                                    <button
                                                                        type="button"
                                                                        className="float-right btn btn-indigo disabled"
                                                                    >
                                                                        Selecionada
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="float-right btn btn-primary"
                                                                        onClick={(e) => addQuestion(question)}
                                                                    >
                                                                        Adicionar <i className="fe fe-file-plus" />
                                                                    </button>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            }
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
                                        disabled={isLoadingQuestions || isLoadingTags}
                                    />
                                </Col>
                            </Row>
                        </TabPanel>
                        <TabPanel
                            className='mt-4'
                            value={tabIndex}
                            index={1}
                        >
                            <Row className='mb-4'>
                                <Col className='col-12'>
                                    <Load className={`${!(isLoadingObjectiveQuestions) ? 'd-none' : ''}`} />
                                    <table className={`table table-hover ${isLoadingObjectiveQuestions ? 'd-none' : ''}`}>
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Código</th>
                                                <th>Dificuldade</th>
                                                <th>Autor(a)</th>
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
                                                    <td>{question.author.email}</td>
                                                    <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary mr-2"
                                                            title="Ver informações"
                                                            onClick={() => handleShowObjectiveQuestionModal(question)}>
                                                            <i className="fa fa-info" />
                                                        </button>
                                                        {selectedQuestions
                                                            .map((s) => s.id)
                                                            .includes(question.id) ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-indigo disabled"
                                                                >
                                                                    Selecionada
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={(e) => addQuestion(question)}
                                                                >
                                                                    Adicionar <i className="fe fe-file-plus" />
                                                                </button>
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
                        <TabPanel
                            className='mt-4'
                            value={tabIndex}
                            index={2}
                        >
                            <Row className='mb-4'>
                                <Col className='col-12'>
                                    <Load className={`${!(isLoadingDiscursiveQuestions) ? 'd-none' : ''}`} />
                                    <table className={`table table-hover ${isLoadingDiscursiveQuestions ? 'd-none' : ''}`}>
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Código</th>
                                                <th>Dificuldade</th>
                                                <th>Autor(a)</th>
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
                                                    <td>{question.author.email}</td>
                                                    <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary mr-2"
                                                            title="Ver informações"
                                                            onClick={() => handleShowDiscursiveQuestionModal(question)}>
                                                            <i className="fa fa-info" />
                                                        </button>
                                                        {selectedQuestions
                                                            .map((s) => s.id)
                                                            .includes(question.id) ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-indigo disabled"
                                                                >
                                                                    Selecionada
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={(e) => addQuestion(question)}
                                                                >
                                                                    Adicionar <i className="fe fe-file-plus" />
                                                                </button>
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
                        </TabPanel>
                        <hr />
                        <Row>
                            <div className="col-12 text-center">
                                <label>Exercícios selecionados</label>
                                <table className="table table-hover table-responsive-md">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Código</th>
                                            <th>Autor(a)</th>
                                            <th>Criado em</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedQuestions.map((question, index) => (
                                            <tr key={index}>
                                                <td>{question.title}</td>
                                                <td>{question.code}</td>
                                                <td>{question.author.email}</td>
                                                <td>{moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        style={{
                                                            float: "right",
                                                            backgroundColor: "red",
                                                            borderColor: "red",
                                                            color: "white",
                                                        }}
                                                        onClick={() => removeQuestion(question)}
                                                    >
                                                        <i className="fe fe-file-minus" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Row>
                        <Row>
                            <Col className='col-12 text-center'>
                                <button
                                    type="submit"
                                    className={`btn btn-primary float-right col-3 ${isLoadingQuestions || isLoadingTags ? "btn-loading" : ""
                                        }`}
                                    style={{ width: "100%" }}
                                >
                                    Salvar Lista
                                        </button>
                            </Col>
                        </Row>
                    </form>

                </CardBody>
            </Card>
            <Dialog
                open={showModalInfo}
                maxWidth={'md'}
                onClose={() => setShowModalInfo(false)}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <DialogTitle id="contained-modal-title-vcenter">
                    {modalQuestion && modalQuestion.title}
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
                                {modalQuestion && <SunEditor
                                    lang="pt_br"
                                    height="auto"
                                    width='100%'
                                    disable={true}
                                    showToolbar={false}
                                    // onChange={this.handleDescriptionChange.bind(this)}
                                    setContents={modalQuestion.description}
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
                    {modalQuestion && modalQuestion.katexDescription &&
                        <Row>
                            <Col className='col-12' textCenter>
                                <BlockMath>
                                    {modalQuestion.katexDescription}
                                </BlockMath>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col className='col-12'>
                            <TableIO results={(modalQuestion && modalQuestion.results) || []} />
                        </Col>
                    </Row>

                    <Row>
                        <Col className='col-12 mb-2'>
                            <b>Autor(a):</b> {modalQuestion && modalQuestion.author.email}
                        </Col>
                        {modalQuestion && modalQuestion.tags && !!modalQuestion.tags.length &&
                            <Col className='col-12 mb-2'>
                                <b>Tags: </b> {modalQuestion && modalQuestion.tags.join(", ")}
                            </Col>
                        }
                        <Col className='col-12'>
                            <b>Data de criação:</b>{" "}
                            {modalQuestion && moment(modalQuestion.createdAt).local().format('DD/MM/YYYY - HH:mm')}
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
                                    <div className='w-100' ref={(el) => editorRef.current[0] = el} >
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
    );
    //}
}

export default FormListSubscreen;