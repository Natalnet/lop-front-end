import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getStateFormQuestionsFromStorage } from "../../../util/auxiliaryFunctions.util";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import moment from "moment";
import SwalModal from "components/ui/modal/swalModal.component";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TableIO from "components/ui/tables/tableIO.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ExerciciosPaginados from "components/screens/exerciciosPaginados.componenete.screen";
import HTMLFormat from "components/ui/htmlFormat";

export default class HomeExerciciosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: getStateFormQuestionsFromStorage("contentInputSeach"),
      radioAsc: getStateFormQuestionsFromStorage("radioAsc"),
      radioDesc: getStateFormQuestionsFromStorage("radioDesc"),
      valueRadioSort: getStateFormQuestionsFromStorage("valueRadioSort"),
      sortBy: getStateFormQuestionsFromStorage("sortBy"),
      tagSelecionada: getStateFormQuestionsFromStorage("tagSelecionada"),
      fildFilter: getStateFormQuestionsFromStorage("fildFilter"),
      docsPerPage: getStateFormQuestionsFromStorage("docsPerPage"),
      numPageAtual: sessionStorage.getItem("pageQuestions") || 1,

      showModalInfo: false,
      exercicios: [],
      question: "",
      showModal: false,
      loadingExercicios: false,
      loadingTags: false,
      tags: [],
      allTags: [],
      showFilter: false,
      totalItens: 0,
      totalPages: 0,
    };
    this.handlePage = this.handlePage.bind(this);
  }
  async componentDidMount() {
    document.title = "Exercícios - professor";
    await this.getTags();
    this.getExercicios();
  }
  async getExercicios() {
    const {
      numPageAtual,
      contentInputSeach,
      fildFilter,
      docsPerPage,
      valueRadioSort,
      sortBy,
      tagSelecionada,
    } = this.state;
    let query = `include=${contentInputSeach.trim()}`;
    query += `&docsPerPage=${docsPerPage}`;
    query += `&field=${fildFilter}`;
    query += `&sortBy=${sortBy}`;
    query += `&sort=${valueRadioSort}`;
    query += `&tag=${tagSelecionada || ''}`;
    try {
      this.setState({ loadingExercicios: true });
      const response = await api.get(`/question/page/${numPageAtual}?${query}`);
      console.log('questions: ',response.data)
      this.setState({
        exercicios: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingExercicios: false,
      });
      sessionStorage.setItem("pageQuestions", response.data.currentPage);
      sessionStorage.setItem("contentInputSeach", contentInputSeach);
      sessionStorage.setItem("docsPerPage", docsPerPage);
      sessionStorage.setItem("fildFilter", fildFilter);
      sessionStorage.setItem("sortBy", sortBy);
      sessionStorage.setItem("valueRadioSort", valueRadioSort);
      sessionStorage.setItem(
        "radioAsc",
        valueRadioSort === "ASC" ? true : false
      );
      sessionStorage.setItem(
        "radioDesc",
        valueRadioSort === "DESC" ? true : false
      );
      sessionStorage.setItem("tagSelecionada",tagSelecionada || '');

    } catch (err) {
      this.setState({ loadingExercicios: false });
      console.log(err);
    }
  }
  async getTags() {
    try {
      this.setState({ loadingTags: true });
      const response = await api.get("/tag");
      const tags = response.data;
      this.setState({
        tags,
        loadingTags: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ loadingTags: false });
    }
  }
  handleRadio(e) {
    this.setState({
      radioAsc: e.target.value === "ASC" ? true : false,
      radioDesc: e.target.value === "DESC" ? true : false,
      valueRadioSort: e.target.value,
    });
  }
  handleDocsPerPage(e) {
    this.setState({
      docsPerPage: e.target.value,
    });
  }
  handleSort(e) {
    this.setState({
      sortBy: e.target.value,
    });
  }
  async handleTagsChangeTags(e) {
    this.setState({
      tagSelecionada: e.target.value,
    });
  }
  handleShowfilter() {
    const { showFilter } = this.state;
    this.setState({ showFilter: !showFilter });
  }
  handleShowModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getExercicios()
    );
  }
  handleSelectfildFilter(e) {
    this.setState(
      {
        fildFilter: e.target.value,
      } /*,()=>this.getExercicios()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      } /*,()=>this.getExercicios()*/
    );
  }
  filterSeash(e) {
    e.preventDefault();
    this.getExercicios();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getExercicios()
    );
  }
  handleShowModalInfo(question) {
    this.setState({
      question: question,
      showModalInfo: true,
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }

  render() {
    const { showModalInfo, question } = this.state;
    return (
      <TemplateSistema active="exercicios">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{ margin: "0px" }}>Exercícios</h5>
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={12}>
            <Link to="/professor/criarExercicio">
              <button className="btn btn-primary">Criar Exercício</button>
            </Link>
          </Col>
        </Row>
        <ExerciciosPaginados
          {...this.state}
          {...this.props}
          handleShowfilter={this.handleShowfilter.bind(this)}
          filterSeash={this.filterSeash.bind(this)}
          handleContentInputSeach={this.handleContentInputSeach.bind(this)}
          handleSelectfildFilter={this.handleSelectfildFilter.bind(this)}
          handleSort={this.handleSort.bind(this)}
          handleRadio={this.handleRadio.bind(this)}
          handleDocsPerPage={this.handleDocsPerPage.bind(this)}
          handleTagsChangeTags={this.handleTagsChangeTags.bind(this)}
          handleShowModalInfo={this.handleShowModalInfo.bind(this)}
          handlePage={this.handlePage.bind(this)}
        />
        <SwalModal
          show={showModalInfo}
          title="Exercício"
          handleModal={this.handleCloseshowModalInfo.bind(this)}
          width={"90%"}
        >
          <Card>
            <CardHead>
              <CardTitle>{question && question.title}</CardTitle>
            </CardHead>
            <CardBody>
              <Row>
                <b>Descrição: </b>
              </Row>
              <Row>
                <span style={{ overflow: "auto" }}>
                  <HTMLFormat>{question && question.description}</HTMLFormat>
                </span>
              </Row>
              <Row>
                <Col xs={12} textCenter>
                  <BlockMath>
                    {(question && question.katexDescription) || ""}
                  </BlockMath>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <TableIO results={(question && question.results) || []} />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Row>
                <Col xs={12} mb={15}>
                  <b>Autor:</b> {question && question.author.email}
                </Col>
                <Col xs={12} mb={15}>
                  <b>Tags: </b> {question && question.tags.join(", ")}
                </Col>
                <Col xs={12}>
                  <b>Data de criação:</b>{" "}
                  {question && moment(question.createdAt).local().format('DD/MM/YYYY - HH:mm')}
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </SwalModal>
      </TemplateSistema>
    );
  }
}
/*
                                        
*/
