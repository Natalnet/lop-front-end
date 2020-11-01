import React, { useEffect, useState, useCallback, useMemo } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import { Pagination } from "components/ui/navs";
import { getStateFormQuestionsFromStorage } from "../../util/auxiliaryFunctions.util";
import moment from "moment";
import SwalModal from "components/ui/modal/swalModal.component";
import FormFilterQuestion from 'components/ui/forms/formFilterQuestions'
import "katex/dist/katex.min.css";
import { Load } from 'components/ui/load';
import { BlockMath } from "react-katex";
import TableIO from "components/ui/tables/tableIO.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
//import HTMLFormat from "components/ui/htmlFormat";
import useQuestion from '../../hooks/useQuestion';
import usePagination from '../../hooks/usePagination';
import useTag from '../../hooks/useTag';

export default props => {

    const profile = useMemo(() => sessionStorage.getItem("user.profile"), [props])
    const email = useMemo(() => sessionStorage.getItem("user.email"), [props])
    const arrDifficulty = useMemo(() =>
        [null, "Muito fácil", "Fácil", "Médio", "Difícil", "Muito Difícil"]
        , [props])

    //const [showFilter, setShowFilter] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //question hook
    const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
    const { tags, isLoadingTags, getTags } = useTag();
    //pagination hook
    const { page, docsPerPage, totalPages, handlePage, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination(
        getStateFormQuestionsFromStorage("pageQuestions"),
        getStateFormQuestionsFromStorage("docsPerPageQuestions")
    );

    const [titleOrCodeInput, setTitleOrCodeInput] = useState(getStateFormQuestionsFromStorage("titleOrCodeInputQuestions"));
    const [fieldSelect, setFieldSelect] = useState(getStateFormQuestionsFromStorage("fieldSelectQuestions"));
    const [sortBySelect, setSortBySelect] = useState(getStateFormQuestionsFromStorage("sortBySelectQuestions"));
    const [sortRadio, setSortRadio] = useState(getStateFormQuestionsFromStorage("sortRadioQuestions"));
    const [ascRadio, setAscRadio] = useState(getStateFormQuestionsFromStorage("radioAscQuestions"));
    const [descRadio, setDescRadio] = useState(getStateFormQuestionsFromStorage("radioDescQuestions"));
    const [tagSelect, setTagSelect] = useState(getStateFormQuestionsFromStorage("tagSelectQuestion"));

    const [filteredTitleOrCodeInput, setFilteredTitleOrCodeInput] = useState(getStateFormQuestionsFromStorage("titleOrCodeInputQuestions"));
    const [filteredFieldSelect, setFilteredFieldSelect] = useState(getStateFormQuestionsFromStorage("fieldSelectQuestions"));
    const [filteredSortBySelect, setFilteredSortBySelect] = useState(getStateFormQuestionsFromStorage("sortBySelectQuestions"));
    const [filteredDocsPerPage, setFilteredDocsPerPage] = useState(getStateFormQuestionsFromStorage("docsPerPageQuestions"));
    const [filteredSortRadio, setFilteredSortRadio] = useState(getStateFormQuestionsFromStorage("sortRadioQuestions"));
    const [filteredTagSelect, setFilteredTagSelect] = useState(getStateFormQuestionsFromStorage("tagSelectQuestion"));

    const [selectedQuestionToShowInModal, setSelectedQuestionToShowInModal] = useState(null);
    useEffect(() => {
        getTags();
    }, [])

    const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

    const getFilteredQuerys = useCallback(() => {
        let query = `include=${filteredTitleOrCodeInput.trim()}`;
        query += `&field=${filteredFieldSelect}`;
        query += `&docsPerPage=${filteredDocsPerPage}`;
        query += `&sortBy=${filteredSortBySelect}`;
        query += `&sort=${filteredSortRadio}`;
        query += `&tag=${filteredTagSelect || ''}`;
        if(profile === "PROFESSOR")
            query += `&status=PÚBLICA PRIVADA`;
        return query;
    }, [filteredTitleOrCodeInput, filteredFieldSelect, filteredSortBySelect, filteredSortRadio, filteredTagSelect, filteredDocsPerPage, profile]);

    const getQuerys = useCallback(() => {
        let query = `include=${titleOrCodeInput.trim()}`;
        query += `&field=${fieldSelect}`;
        query += `&docsPerPage=${docsPerPage}`;
        query += `&sortBy=${sortBySelect}`;
        query += `&sort=${sortRadio}`;
        query += `&tag=${tagSelect || ''}`;
        if(profile === "PROFESSOR")
            query += `&status=PÚBLICA PRIVADA`;
        return query;
    }, [titleOrCodeInput, fieldSelect, sortBySelect, sortRadio, tagSelect, docsPerPage, profile]);

    const saveQuerysInStorage = useCallback(() => {
        setFilteredTitleOrCodeInput(() => titleOrCodeInput);
        setFilteredFieldSelect(() => fieldSelect);
        setFilteredSortBySelect(() => sortBySelect);
        setFilteredDocsPerPage(() => docsPerPage);
        setFilteredSortRadio(() => sortRadio);
        setFilteredTagSelect(() => tagSelect);
        sessionStorage.setItem("titleOrCodeInputQuestions", titleOrCodeInput);
        sessionStorage.setItem("fieldSelectQuestions", fieldSelect);
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
    }, [titleOrCodeInput, fieldSelect, sortBySelect, sortRadio, tagSelect, docsPerPage]);

    useEffect(() => {
        getPaginedQuestions(page, getFilteredQuerys());
        sessionStorage.setItem("pageQuestions", page);
    }, [page])

    const handleSortRadio = useCallback(e => {
        setAscRadio(e.target.value === "ASC" ? true : false);
        setDescRadio(e.target.value === "DESC" ? true : false);
        setSortRadio(e.target.value)
    }, []);

    const handlleFilter = useCallback(() => {
        getPaginedQuestions(page, getQuerys());
        saveQuerysInStorage()
    }, [page, saveQuerysInStorage, getQuerys]);

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

    return (
        <>
            <FormFilterQuestion
                titleOrCodeInput={titleOrCodeInput}
                ascRadio={ascRadio}
                descRadio={descRadio}
                docsPerPage={docsPerPage}
                fieldSelect={fieldSelect}
                tagSelect={tagSelect}
                tagsSelect={tagsSelect}
                sortBySelect={sortBySelect}
                loading={isLoadingQuestions}
                handlleFilter={handlleFilter}
                handleSortBySelect={(e) => setSortBySelect(e.target.value)}
                handleTitleOrCodeInput={(e) => setTitleOrCodeInput(e.target.value)}
                handleDocsPerPage={(e) => setDocsPerPage(e.target.value)}
                handleFieldSelect={(e) => setFieldSelect(e.target.value)}
                handleTagSelect={(e) => setTagSelect(e.target.value)}
                handleSortRadio={handleSortRadio}
            />

            <Row mb={15}>
                <Col xs={12}>
                    <Load className={`${!(isLoadingQuestions || isLoadingTags)?'d-none':''}`}/>
                    <table className={`table table-hover table-responsive ${isLoadingQuestions || isLoadingTags?'d-none':''}`}>
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
                                        {(profile === "ALUNO") ? (
                                            <>
                                                <Link to={`/aluno/exercicio/${question.id}`} >
                                                    <button className="btn btn-success mr-2">
                                                        Acessar <i className="fa fa-wpexplorer" />
                                                    </button>
                                                </Link>
                                                <button className="btn btn-primary mr-2" onClick={() => handleShowModal(question)}>
                                                    <i className="fa fa-info" />
                                                </button>
                                            </>
                                        )
                                            :
                                            (profile === "PROFESSOR") ? (
                                                <>
                                                    <Link to={`/professor/exercicio/${question.id}`} >
                                                        <button className="btn btn-success mr-2" title="Acessar Exercício">
                                                            Acessar <i className="fa fa-wpexplorer" />
                                                        </button>
                                                    </Link>
                                                    <button className="btn btn-primary mr-2" title="Ver informações" onClick={() => handleShowModal(question)}>
                                                        <i className="fa fa-info" />
                                                    </button>
                                                   
                                                    <Link to={`/professor/exercicios/${question.id}/editar`}>
                                                        <button className={`btn btn-info mr-2 ${(email !== question.author.email) ? "d-none" : ""}` } title="Editar Exercício">
                                                            <i className="fe fe-edit" />
                                                        </button>
                                                    </Link>
                                                    <Link to={`/professor/criarExercicio?idQuestion=${question.id}`} >
                                                        <button className="btn btn-warning mr-2" title="Clonar Exercício">
                                                            <i className="fa fa-copy" />
                                                        </button>
                                                    </Link>
                                                </>
                                            )
                                                :
                                                null
                                        }

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
                                {selectedQuestionToShowInModal  && <SunEditor 
                                    lang="pt_br"
                                    height="auto"
                                    disable={true}
                                    showToolbar={false}
                                    // onChange={this.handleDescriptionChange.bind(this)}
                                    setContents={selectedQuestionToShowInModal.description}
                                    setDefaultStyle="font-size: 15px; text-align: justify"
                                    setOptions={{
                                        toolbarContainer : '#toolbar_container',
                                        resizingBar : false,
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
                        {profile === "PROFESSOR" &&
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
