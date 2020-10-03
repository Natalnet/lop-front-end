import React, { useEffect, useCallback, useMemo, useState } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import FormFilterQuestion from 'components/ui/forms/formFilterQuestions';
import 'katex/dist/katex.min.css'
import { Link, useHistory } from "react-router-dom";
//import Swal from "sweetalert2";
import useQuestion from '../../../hooks/useQuestion';
import usePagination from '../../../hooks/usePagination';
import useList from '../../../hooks/useList';
import useTag from '../../../hooks/useTag';
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import moment from "moment";
import { Load } from 'components/ui/load';
import { Pagination } from "components/ui/navs";
import SwalModal from "components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from "components/ui/tables/tableIO.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default props => {

  const { paginedQuestions, isLoadingQuestions, getPaginedQuestions } = useQuestion();
  const { page, totalPages, docsPerPage, handlePage, setDocsPerPage, setPage, setTotalPages, setTotalDocs } = usePagination();
  const {updateList: updateCurrentList} = useList();
  const { tags, isLoadingTags, getTags } = useTag();

  const [title, setTitle] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [modalQuestion, setModalQuestion] = useState({});

  const [isLoadingQuestionsByList,setIsLoadingQuestionsByList]= useState(false)

  const [titleOrCodeInput, setTitleOrCodeInput] = useState('');
  const [fieldSelect, setFieldSelect] = useState('title');
  const [sortBySelect, setSortBySelect] = useState('');
  const [sortRadio, setSortRadio] = useState('DESC');
  const [ascRadio, setAscRadio] = useState(false);
  const [descRadio, setDescRadio] = useState(true);
  const [tagSelect, setTagSelect] = useState('');

  // const [filteredTitleOrCodeInput, setFilteredTitleOrCodeInput] = useState('');
  // const [filteredFieldSelect, setFilteredFieldSelect] = useState('title');
  // const [filteredSortBySelect, setFilteredSortBySelect] = useState('');
  // const [filteredDocsPerPage, setFilteredDocsPerPage] = useState(15);
  // const [filteredSortRadio, setFilteredSortRadio] = useState('DESC');
  // const [filteredTagSelect, setFilteredTagSelect] = useState('');

  const tagsSelect = useMemo(() => [{ id: '', name: 'Todas' }, ...tags], [tags])

  const history = useHistory();

  // async componentDidMount() {
  //   document.title = "Editar lista - professor";
  //   await this.getQuestionsByList();
  //   this.getExercicios();
  // }
  useEffect(() => {
    getTags();
  }, [])

  useEffect(() => {
    document.title = "Editar lista - professor";
    getQuestionsByList()
  }, [])

  useEffect(() => {
    getPaginedQuestions(page, getQuerys());
  }, [page])

  useEffect(() => {
    //console.log('question: ', paginedQuestions);
    if (paginedQuestions) {
      setPage(paginedQuestions.currentPage);
      setTotalDocs(paginedQuestions.total);
      setDocsPerPage(paginedQuestions.perPage);
      setTotalPages(paginedQuestions.totalPages)
    }
  }, [paginedQuestions])


  const getQuestionsByList = useCallback( async () =>{
    const { id } = props.match.params;
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
  },[])

  const updateList = useCallback( async (e)=> {
    e.preventDefault();
    const { id } = props.match.params;
    const isUpdated = await updateCurrentList(id, {title, selectedQuestions})
    if(isUpdated){
      history.push("/professor/listas");
    }
  },[title, selectedQuestions])

  const getQuerys = useCallback(() => {
    let query = `include=${titleOrCodeInput.trim()}`;
    query += `&field=${fieldSelect}`;
    query += `&docsPerPage=${docsPerPage}`;
    query += `&sortBy=${sortBySelect}`;
    query += `&sort=${sortRadio}`;
    query += `&tag=${tagSelect || ''}`;
    query += `&status=PÚBLICA PRIVADA`;
    return query;
  }, [titleOrCodeInput, fieldSelect, sortBySelect, sortRadio, tagSelect, docsPerPage]);

  const saveQuerys = useCallback(() => {
    // setFilteredTitleOrCodeInput(() => titleOrCodeInput);
    // setFilteredFieldSelect(() => fieldSelect);
    // setFilteredSortBySelect(() => sortBySelect);
    // setFilteredDocsPerPage(() => docsPerPage);
    // setFilteredSortRadio(() => sortRadio);
    // setFilteredTagSelect(() => tagSelect);

  }, [titleOrCodeInput, fieldSelect, sortBySelect, sortRadio, tagSelect, docsPerPage]);

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
            isLoadingQuestionsByList?
            <Load/>
          :
            <form onSubmit={(e) => updateList(e)} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}>
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
                    fieldSelect={fieldSelect}
                    tagSelect={tagSelect}
                    tagsSelect={tagsSelect}
                    sortBySelect={sortBySelect}
                    loading={isLoadingQuestions || isLoadingTags || isLoadingQuestionsByList}
                    handlleFilter={handlleFilter}
                    handleSortBySelect={(e) => setSortBySelect(e.target.value)}
                    handleTitleOrCodeInput={(e) => setTitleOrCodeInput(e.target.value)}
                    handleDocsPerPage={(e) => setDocsPerPage(e.target.value)}
                    handleFieldSelect={(e) => setFieldSelect(e.target.value)}
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
                      {isLoadingQuestions || isLoadingTags || isLoadingQuestionsByList ? (
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
                                        onClick={() => addQuestion(question)}
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
                    disabled={isLoadingQuestions || isLoadingTags  || isLoadingQuestionsByList}
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
                              className={`btn btn-primary ${isLoadingQuestions || isLoadingTags  || isLoadingQuestionsByList? "btn-loading" : ""}`}
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
                    className={`btn btn-primary float-right col-3 ${isLoadingQuestions || isLoadingTags  || isLoadingQuestionsByList? "btn-loading" : ""
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

        <SwalModal
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
                <Col xs={12}>
                  <TableIO results={modalQuestion.results || []} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </SwalModal>
      </Card>
    </TemplateSistema>
  );

}
