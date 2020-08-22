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

    const [showFilter, setShowFilter] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //question hook
    const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
    const { tags, isLoadingTags, getTags } = useTag();
    //paginaation hook
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
        return query;
    }, [filteredTitleOrCodeInput, filteredFieldSelect, filteredSortBySelect, filteredSortRadio, filteredTagSelect, filteredDocsPerPage]);

    const getQuerys = useCallback(() => {
        let query = `include=${titleOrCodeInput.trim()}`;
        query += `&field=${fieldSelect}`;
        query += `&docsPerPage=${docsPerPage}`;
        query += `&sortBy=${sortBySelect}`;
        query += `&sort=${sortRadio}`;
        query += `&tag=${tagSelect || ''}`;
        return query;
    }, [titleOrCodeInput, fieldSelect, sortBySelect, sortRadio, tagSelect, docsPerPage]);

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

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
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
            <Card>
                <CardHead
                    onClick={() => setShowFilter(oldShowfilter => !oldShowfilter)}
                    style={{ cursor: "pointer" }}>
                    <CardTitle center>
                        {showFilter ? 'Ocultar ' : 'Exibir '} filtro &nbsp;
                        <i
                            className="fa fa-chevron-down"
                            style={{ color: "#00f" }}
                        />
                    </CardTitle>
                </CardHead>
                {showFilter
                    ?
                    <CardBody className="card-filter-exercicio" overflow="visible">
                        <form onSubmit={handleSubmit}>
                            <Row mb={10}>

                                <Col xs={12} md={6} lg={7}>
                                    <label htmlFor="nome">{`${fieldSelect === 'title' ? 'Título ' : fieldSelect === 'code' ? 'Código' : '...'} do exercício`} </label>
                                    <div className="input-group">
                                        <input
                                            id="nome"
                                            type="text"
                                            className="form-control"
                                            placeholder={`Perquise pelo ${fieldSelect === 'title' ? 'Título' : fieldSelect === 'code' ? 'Código' : '...'} do exercício`}
                                            aria-label="Recipient's username"
                                            aria-describedby="button-addon2"
                                            value={titleOrCodeInput}
                                            onChange={(e) => setTitleOrCodeInput(e.target.value)}
                                        />
                                        <div className="selectgroup" >
                                            <select style={{ cursor: "pointer" }} defaultValue={fieldSelect} onChange={(e) => setFieldSelect(e.target.value)} className="selectize-input items has-options full has-items form-control">
                                                <option value={'title'}>Título</option>
                                                <option value={'code'}>Código</option>
                                            </select>
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={12} md={6} lg={3}>
                                    <label htmlFor="ordem">Ordenar por:</label>
                                    <div className="selectgroup" style={{ display: 'flex', width: '100%' }}>
                                        <select id={"ordem"} defaultValue={sortBySelect} className="form-control" onChange={(e) => setSortBySelect(e.target.value)} style={{ cursor: "pointer" }}>
                                            <option value={''}>Aleatório</option>
                                            <option value={'createdAt'}>Data de criação</option>
                                            <option value={'title'}>Ordem alfabética</option>
                                            <option value={'difficulty'}>Dificuldade</option>
                                            {/*<option value={'isCorrect'}>Resolvidas por mim</option>
                                <option value={'accessCount'}>N° de acessos</option>
                                <option value={'submissionsCount'}>N° de Submissões</option>
                                <option value={'submissionsCorrectsCount'}>N° de Submissões corretas</option>*/}
                                        </select>
                                        <label className="selectgroup-item">
                                            <input type="radio"
                                                value="DESC"
                                                checked={descRadio}
                                                className="selectgroup-input"
                                                onChange={handleSortRadio}
                                            />
                                            <span className="selectgroup-button selectgroup-button-icon">
                                                <i className="fa fa-sort-amount-desc" />
                                            </span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input type="radio"
                                                value="ASC"
                                                checked={ascRadio}
                                                onChange={handleSortRadio}
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button selectgroup-button-icon">
                                                <i className="fa fa-sort-amount-asc" />
                                            </span>
                                        </label>
                                    </div>
                                </Col>

                                <Col xs={6} lg={2}>
                                    <label htmlFor="pag">N° de itens por página:</label>
                                    <select id="pag" defaultValue={docsPerPage} className="form-control" onChange={(e) => setDocsPerPage(e.target.value)}>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={40}>40</option>
                                        <option value={60}>60</option>
                                    </select>
                                </Col>

                                <Col xs={6} lg={3}>
                                    <label>Tag: </label>
                                    <select
                                        onChange={(e) => setTagSelect(e.target.value)}
                                        className="form-control"
                                        defaultValue={tagSelect}
                                    >
                                        {tagsSelect.map(tag => (
                                            <option
                                                key={tag.id}
                                                value={tag.id}
                                            >
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select>
                                    {/* <Select
                            style={{boxShadow: "white"}}
                            defaultValue={tagSelecionada}
                            placeholder="informe as tags"
                            options={tags || []}
                            isMulti
                            isLoading={loadingTags}
                            isClearable={false}
                            onChange={handleTagsChangeTags}
                        /> */}
                                </Col>

                                <Col xs={4}>
                                    <label htmlFor="app">&nbsp;</label>
                                    <button type='submit' className={`form-control btn btn-primary ${isLoadingQuestions && 'btn-loading'}`}>
                                        Aplicar filtro <i className="fe fe-search" />
                                    </button>
                                </Col>
                            </Row>
                        </form>
                    </CardBody>
                    : null
                }
            </Card>
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
                                                        <button className="btn btn-success mr-2">
                                                            Acessar <i className="fa fa-wpexplorer" />
                                                        </button>
                                                    </Link>
                                                    <button className="btn btn-primary mr-2" onClick={() => handleShowModal(question)}>
                                                        <i className="fa fa-info" />
                                                    </button>
                                                    <Link to={`/professor/exercicios/${question.id}/editar`}>
                                                        <button className={`btn btn-info ${(email !== question.author.email) ? "d-none" : ""}`}>
                                                            <i className="fe fe-edit" />
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
                                <b>Autor:</b> {selectedQuestionToShowInModal && selectedQuestionToShowInModal.author.email}
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
