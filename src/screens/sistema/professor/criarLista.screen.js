import React, { useState, useEffect, useCallback, useMemo } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link, useHistory, useLocation } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import moment from "moment";
import api from "../../../services/api";
import { Load } from '../../../components/ui/load';
import useQuestion from '../../../hooks/useQuestion';
import usePagination from '../../../hooks/usePagination';
import useList from '../../../hooks/useList';
import useTag from '../../../hooks/useTag';
import { Pagination } from "../../../components/ui/navs";
import FormFilterQuestion from '../../../components/ui/forms/formFilterQuestions';
import SwalModal from "../../../components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from "../../../components/ui/tables/tableIO.component";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import CardFooter from "../../../components/ui/card/cardFooter.component";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";

//import HTMLFormat from "../../../components/ui/htmlFormat";

export default props => {

  const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
  const { page, totalPages, docsPerPage, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination();
  const { createList: createNewList } = useList()
  const { tags, isLoadingTags, getTags } = useTag();

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

  // const [filteredTitleOrCodeInput, setFilteredTitleOrCodeInput] = useState('');
  // const [filteredSortBySelect, setFilteredSortBySelect] = useState('');
  // const [filteredDocsPerPage, setFilteredDocsPerPage] = useState(15);
  // const [filteredSortRadio, setFilteredSortRadio] = useState('DESC');
  // const [filteredTagSelect, setFilteredTagSelect] = useState('');

  const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

  const history = useHistory();
  const location = useLocation();

  const getQuerys = useCallback(() => {
    let query = `titleOrCode=${titleOrCodeInput.trim()}`;
    query += `&docsPerPage=${docsPerPage}`;
    query += `&sortBy=${sortBySelect}`;
    query += `&sort=${sortRadio}`;
    query += `&tag=${tagSelect || ''}`;
    query += `&status=PÚBLICA PRIVADA`;
    return query;
  }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage]);

  useEffect(() => {
    getTags();
    getPaginedQuestions(page, getQuerys());
    document.title = "Criar lista - professor";
    const { search } = location;
    if (search.includes('?idList=')) {
      const id = search.replace('?idList=', '')
      getQuestionsByList(id);
    }
  }, [])

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

  const createList = useCallback(async e => {
    e.preventDefault();
    const isCreated = await createNewList({ title, selectedQuestions })
    if (isCreated) {
      history.push("/professor/listas");
    }
  }, [title, selectedQuestions])

  const saveQuerys = useCallback(() => {

  }, [titleOrCodeInput, sortBySelect, sortRadio, tagSelect, docsPerPage]);

  const addQuestion = useCallback(selectedQuestion => {
    setSelectedQuestions(oldSelectedQuestions => [...oldSelectedQuestions, selectedQuestion])
  }, [])

  const removeQuestion = useCallback(removedQuestion => {
    setSelectedQuestions(oldSelectedQuestions => oldSelectedQuestions.filter(q =>
      q.id !== removedQuestion.id
    ))
  }, [selectedQuestions])

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
  }, [page, saveQuerys, getQuerys]);




  return (
    <TemplateSistema active="listas">

      <Row mb={15}>
        <Col xs={12}>
          <h5 style={{ margin: "0px" }}>
            <Link to="/professor/listas">Listas</Link>
            <i className="fa fa-angle-left ml-2 mr-2" />
              Criar lista
            </h5>
        </Col>
      </Row>
      <Card>
        <CardBody>
          {
            isLoadingQuestionsByList ?
              <Load />
              :
              <form onSubmit={(e) => createList(e)} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}>
                <div className="form-row">
                  <div className="form-group col-12">
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
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
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
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
                    <table
                      className="table table-hover"
                      style={{ borderTopRightRadius: "10%", marginBottom: "0px" }}
                    >
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Código</th>
                          <th>Submissões gerais (corretas/total)</th>
                          <th>Criado por</th>
                          <th>Criado em</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingQuestions || isLoadingTags ? (
                          <tr>
                            <td>
                              <div className="loader" />
                            </td>
                            <td>
                              <div className="loader" />
                            </td>
                            <td>
                              <div className="loader" />
                            </td>
                            <td>
                              <div className="loader" />
                            </td>
                            <td>
                              <div className="loader" />
                            </td>
                          </tr>
                        ) : (
                            !paginedQuestions ? [] : paginedQuestions.docs.map((question) => {
                              return (
                                <tr key={question.id}>
                                  <td>{question.title}</td>
                                  <td>{question.code}</td>
                                  <td>{`(${question.submissionsCorrectsCount}/${question.submissionsCount})`}</td>
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
                                      )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Row>
                  <Col xs={12} textCenter>
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
                <hr />
                <Row>
                  <div className="col-12 text-center">
                    <label>Selecionadas</label>
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Código</th>
                          <th>Submissões gerais (corretas/total)</th>
                          <th>Criado por</th>
                          <th>Criado em</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuestions.map((question, index) => (
                          <tr key={index}>
                            <td>{question.title}</td>
                            <td>{question.code}</td>
                            <td>{`(${question.submissionsCorrectsCount}/${question.submissionsCount})`}</td>
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
                  <Col xs={12} textCenter>
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
          }
        </CardBody>

        {modalQuestion && <SwalModal
          show={showModalInfo}
          title="Exercício"
          handleModal={() => setShowModalInfo(false)}
          width={"90%"}
        >
          <Card>
            <CardHead>
              <CardTitle>{modalQuestion.title}</CardTitle>
            </CardHead>
            <CardBody>
              <Row>
                <b>Descrição: </b>
              </Row>
              <Row>
                <span style={{ overflow: "auto" }}>
                  {/* <HTMLFormat>{modalQuestion && modalQuestion.description}</HTMLFormat> */}
                  {modalQuestion.description &&
                    <SunEditor
                      lang="pt_br"
                      height="auto"
                      disable={true}
                      showToolbar={false}
                      setContents={modalQuestion.description}
                      setDefaultStyle="font-size: 15px; text-align: justify"
                      setOptions={{
                        toolbarContainer: '#toolbar_container',
                        resizingBar: false,
                        katex: katex,
                      }}
                    />
                  }
                </span>
              </Row>
              <Row>
                <Col xs={12} textCenter>
                  <BlockMath>{modalQuestion.katexDescription || ""}</BlockMath>
                </Col>
              </Row>
              <Row>
                <Col xs={12} mb={15}>
                  <TableIO results={modalQuestion.results || []} />
                </Col>
              </Row>

            </CardBody>
            <CardFooter>
              <Row>
                <Col xs={12} mb={15}>
                  <b>Tags: </b> {modalQuestion.tags.join(", ")}
                </Col>
              </Row>                        
            </CardFooter>
          </Card>
        </SwalModal>}
      </Card>
    </TemplateSistema>
  );
  //}
}
