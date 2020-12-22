import React, { useEffect, useState, useCallback, useMemo } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import { Pagination } from "../ui/navs";
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '../ui/tabs/Tab';
import TabPanel from '../ui/tabs/TabPanel'
import Paper from '@material-ui/core/Paper';
import { getStateFormQuestionsFromStorage } from "../../util/auxiliaryFunctions.util";
import moment from "moment";
import SwalModal from "../ui/modal/swalModal.component";
import FormFilterQuestion from '../ui/forms/formFilterQuestions'
import "katex/dist/katex.min.css";
import { Load } from '../ui/load';
import { BlockMath } from "react-katex";
import TableIO from "../ui/tables/tableIO.component";
import Card from "../ui/card/card.component";
import CardHead from "../ui/card/cardHead.component";
import CardTitle from "../ui/card/cardTitle.component";
import CardBody from "../ui/card/cardBody.component";
import CardFooter from "../ui/card/cardFooter.component";
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
//import HTMLFormat from "../ui/htmlFormat";
import useQuestion from '../../hooks/useQuestion';
import usePagination from '../../hooks/usePagination';
import useTag from '../../hooks/useTag';
import { BiCodeAlt } from 'react-icons/bi'

export default props => {

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), [props])
    const email = useMemo(() => sessionStorage.getItem("user.email").toLowerCase(), [props])
    const arrDifficulty = useMemo(() =>
        [null, "Muito fácil", "Fácil", "Médio", "Difícil", "Muito Difícil"]
        , [props])

    //const [showFilter, setShowFilter] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //question hook
    const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
    //tag hook
    const { tags, isLoadingTags, getTags } = useTag();
    //pagination hook
    const { page, docsPerPage, totalPages, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination(
        getStateFormQuestionsFromStorage("pageQuestions"),
        getStateFormQuestionsFromStorage("docsPerPageQuestions")
    );

    const [tabIndex, setTabIndex] = useState(0);

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
        getPaginedQuestions(page, getFilteredQuerys());
        sessionStorage.setItem("pageQuestions", page);
    }, [])

    const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

    const getFilteredQuerys = useCallback(() => {
        let query = `titleOrCode=${filteredTitleOrCodeInput.trim()}`;
        query += `&docsPerPage=${filteredDocsPerPage}`;
        query += `&sortBy=${filteredSortBySelect}`;
        query += `&sort=${filteredSortRadio}`;
        query += `&tag=${filteredTagSelect || ''}`;
        if (profile === "professor")
            query += `&status=PÚBLICA PRIVADA`;
        return query;
    }, [filteredTitleOrCodeInput, filteredSortBySelect, filteredSortRadio, filteredTagSelect, filteredDocsPerPage, profile]);

    const getQuerys = useCallback(() => {
        let query = `titleOrCode=${titleOrCodeInput.trim()}`;
        query += `&docsPerPage=${docsPerPage}`;
        query += `&sortBy=${sortBySelect}`;
        query += `&sort=${sortRadio}`;
        query += `&tag=${tagSelect || ''}`;
        if (profile === "professor")
            query += `&status=PÚBLICA PRIVADA`;
        return query;
    }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage, profile]);

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
    }, [page, saveQuerysInStorage, getQuerys]);

    const handlePage = useCallback((e, numPage) => {
        e.preventDefault();
        setPage(numPage);
        getPaginedQuestions(numPage, getQuerys());
    }, [getQuerys]);

    useEffect(() => {
        //console.log('question: ', paginedQuestions);
        if (paginedQuestions) {
            setPage(paginedQuestions.currentPage);
            setTotalDocs(paginedQuestions.total);
            setDocsPerPage(paginedQuestions.perPage);
            setTotalPages(paginedQuestions.totalPages)
        }
    }, [paginedQuestions])

    const handleShowModal = useCallback(q => {
        setSelectedQuestionToShowInModal(q);
        setShowModal(true);
    }, []);

    const handleTabeIndex = useCallback((e, newValue) => {
        setTabIndex(newValue)
    }, [])

    const isTeacher = useCallback(() => {
        return profile === 'professor'
    }, [profile])

    const isAuthor = useCallback((author) => {
        return email === author.email && isTeacher()
    }, [email, isTeacher])

    useEffect(() => {
        switch (tabIndex) {
            case 0:
                getPaginedQuestions(page, getQuerys());
                break;

            default:
                break;
        }
    }, [tabIndex, page, getPaginedQuestions])

    return (
        <>
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
            <TabPanel value={tabIndex} index={0}>
                {isTeacher() && (
                    <Row mb={15}>
                        <Col xs={12}>
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

                <Row mb={15}>
                    <Col xs={12}>
                        <Load className={`${!(isLoadingQuestions || isLoadingTags) ? 'd-none' : ''}`} />
                        <table className={`table table-hover table-responsive ${isLoadingQuestions || isLoadingTags ? 'd-none' : ''}`}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>N° de acessos</th>
                                    <th>N° de Submissões corretas</th>
                                    <th>N° de Submissões</th>
                                    <th>Dificuldade</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!paginedQuestions ? [] : paginedQuestions.docs.map((question, index) => (
                                    <tr key={question.id}>
                                        <td>
                                            {question.isCorrect ? (
                                                <i
                                                    className="fa fa-check"
                                                    style={{ color: "#0f0" }}
                                                />
                                            ) : question.wasTried ? (
                                                <i
                                                    className="fa fa-remove"
                                                    style={{ color: "#f00" }}
                                                />
                                            ) : <>&nbsp;</>}
                                        </td>
                                        <td> {question.title}</td>
                                        <td>{question.code}</td>
                                        <td>{question.accessCount}</td>
                                        <td>{question.submissionsCorrectsCount}</td>
                                        <td>{question.submissionsCount}</td>
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
                    <Col xs={12} textCenter>
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
            <TabPanel value={tabIndex} index={1}>
                Questões objetivas
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                Questões Discursivas
            </TabPanel>

            <SwalModal
                show={showModal}
                title="Exercício"
                handleModal={() => setShowModal(false)}
                width={"90%"}
            >
                <Card>
                    <CardHead>
                        <CardTitle>{selectedQuestionToShowInModal && selectedQuestionToShowInModal.title}</CardTitle>
                    </CardHead>
                    <CardBody>
                        <Row>
                            <b>Descrição: </b>
                        </Row>
                        <Row>
                            <span style={{ overflow: "auto" }}>
                                {/* <HTMLFormat>{selectedQuestionToShowInModal && selectedQuestionToShowInModal.description}</HTMLFormat> */}
                                {selectedQuestionToShowInModal && <SunEditor
                                    lang="pt_br"
                                    height="auto"
                                    disable={true}
                                    showToolbar={false}
                                    // onChange={this.handleDescriptionChange.bind(this)}
                                    setContents={selectedQuestionToShowInModal.description}
                                    setDefaultStyle="font-size: 15px; text-align: justify"
                                    setOptions={{
                                        toolbarContainer: '#toolbar_container',
                                        resizingBar: false,
                                        katex: katex,
                                    }}
                                />}
                            </span>
                        </Row>
                        <Row>
                            <Col xs={12} textCenter>
                                <BlockMath>
                                    {(selectedQuestionToShowInModal && selectedQuestionToShowInModal.katexDescription) || ""}
                                </BlockMath>
                            </Col>
                        </Row>
                        {profile === "professor" &&
                            <Row>
                                <Col xs={12}>
                                    <TableIO results={(selectedQuestionToShowInModal && selectedQuestionToShowInModal.results) || []} />
                                </Col>
                            </Row>
                        }
                    </CardBody>
                    <CardFooter>
                        <Row>
                            <Col xs={12} mb={15}>
                                <b>Autor(a):</b> {selectedQuestionToShowInModal && selectedQuestionToShowInModal.author.email}
                            </Col>
                            <Col xs={12} mb={15}>
                                <b>Tags: </b> {selectedQuestionToShowInModal && selectedQuestionToShowInModal.tags.join(", ")}
                            </Col>
                            <Col xs={12}>
                                <b>Data de criação:</b>{" "}
                                {selectedQuestionToShowInModal && moment(selectedQuestionToShowInModal.createdAt).local().format('DD/MM/YYYY - HH:mm')}
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </SwalModal>

        </>
    )
}
