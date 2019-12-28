import React, { Component, Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "katex/dist/katex.min.css";
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ProgressBar from "../../../components/ui/ProgressBar/progressBar.component";

export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listas: [],
      list:'',
      loadingInfoTurma: true,
      loadingDateLimit:false,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",        
      loandingTodasListas: true,
      loandingListas: false,
      showModalListas: false,
      showModalDate: false,
      todasListas: [],
      dateLimit:'',
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      contentInputSeach: "",
      fieldFilter: "title",
      questions: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getListas();
    const {turma} = this.state
    document.title = `${turma && turma.name} - listas`;
  }
  async getInfoTurma(){
    const id = this.props.match.params.id
    const {myClasses} = this.state
    if(myClasses && typeof myClasses==="object"){
        const index = myClasses.map(c=>c.id).indexOf(id)
        if(index!==-1){
            this.setState({
                turma:myClasses[index]
            })
        }
        this.setState({loadingInfoTurma:false})
        return null
    }
    try{
        const response = await api.get(`/class/${id}`)
        this.setState({
            turma:response.data,
            loadingInfoTurma:false,
        })
    }
    catch(err){
        this.setState({loadingInfoTurma:false})
        console.log(err);
    }
  }

  async inserirLista(lista) {
    const {id} = this.props.match.params;
    const idLista = lista.id
    const request = {
      idClass:id,
      idList:idLista
    }
    try {
      Swal.fire({
        title: "Adicionando lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();

      await api.post(`/classHasListQuestion/store`,request);
      this.handleCloseshowModalListas()
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista adicionada com sucesso!"
      });
      
      this.getListas();
      this.handleShowModalDate(lista);
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Lista não pôde ser adicionada"
      });
    }
  }
  async removerLista(list) {
    
    const idClass = this.props.match.params.id;
    const idList = list.id
    const query = `?idClass=${idClass}`
    try {
      const { value } = await Swal.fire({
        title: `Tem certeza que quer remover "${list.title}" da turma?`,
        //text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover lista!",
        cancelButtonText: "Não, cancelar!"
      });
      if (!value) return null;
      Swal.fire({
        title: "Removendo lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      await api.delete(`/classHasListQuestion/${idList}/delete${query}`);
      const { listas } = this.state;
      this.setState({ listas: listas.filter(lista => lista.id !== idList) });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista removida com sucesso!"
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Lista não pôde ser removida"
      });
    }
  }
  async getTodasListas() {
    const { numPageAtual, contentInputSeach, fieldFilter ,listas} = this.state;
    let query = `?idNotInt=${listas.map(l=>l.id).join(" ")}`
    query += `&include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;
  
    try {
      this.setState({ loandingTodasListas: true });
      const response = await api.get(`/listQuestion/page/${numPageAtual}${query}`)
      console.log("todasListas");
      console.log(response.data.docs);
      this.setState({
        todasListas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        loandingTodasListas: false
      });
    } catch (err) {
      this.setState({ loandingTodasListas: false });
      console.log(err);
    }
  }
  async getListas() {
    const id = this.props.match.params.id;
    let query = `?idClass=${id}`
    try {
      this.setState({ loandingListas: true });
      const response = await api.get(`/listQuestion${query}`);
      console.log("listas");
      console.log(response.data);
      this.setState({
        listas: [...response.data],
        loandingListas: false
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }
  async addDateLimit(list){
    const idClass = this.props.match.params.id;
    const idList = list.id
    const query = `?idClass=${idClass}`
    const {dateLimit} = this.state
    if(dateLimit){
      const request = {
        submissionDeadline:dateLimit
      }
      try{
        this.setState({loadingDateLimit:true})
        await api.put(`/classHasListQuestion/${idList}/update${query}`,request)
        this.getListas()
        this.handleCloseShowModalDate()
        this.setState({loadingDateLimit:false})
        Swal.fire({
          type: "success",
          title: "Data limite para submissoões adicionada com sucesso!"
        });
      }
      catch(err){
        console.log(err);
        this.setState({loadingDateLimit:false})
        Swal.fire({
          type: "error",
          title: "ops... data limite não pôde ser adicionada"
        });
      }
    }
  }
  changeDate(e){
    console.log('data');
    console.log(e.target.value);
    this.setState({dateLimit: e.target.value})
  }

  handleShowModalDate(list){
      console.log(list);
      this.setState({
          list:list,
          showModalDate:true,
      })
  }
  handleCloseShowModalDate(e){
      this.setState({showModalDate:false})
  }
  handleShowModalListas(e) {
    this.getTodasListas()
    this.setState({ showModalListas: true });
  }
  handleCloseshowModalListas(e) {
    this.setState({ showModalListas: false });
  }


  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage
      },
      () => this.getTodasListas()
    );
  }


  handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState(
      {
        fieldFilter: e.target.value
      } /*,()=>this.getTodasListas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value
      } /*,()=>this.getTodasListas()*/
    );
  }
  filterSeash() {
    this.getTodasListas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
      },
      () => this.getTodasListas()
    );
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      list,
      showModalDate,
      loadingDateLimit,
      todasListas,
      loandingTodasListas,
      totalPages,
      numPageAtual,
      listas
    } = this.state;
    const {
      contentInputSeach,
      fieldFilter,
      showModalListas,
      loandingListas
    } = this.state;
    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}
              </h3>
            )}
          </div>
        </div>

        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-3">
            <button
              className={`btn btn-primary ${loandingListas && "btn-loading"}`}
              onClick={() => this.handleShowModalListas()}
            >
              Adicionar novas listas <i className="fa fa-plus-circle" />
            </button>
          </div>
        </div>

        <Row mb={15}>
          {loandingListas ? (
            <div className="loader" style={{ margin: "0px auto" }}></div>
          ) : (
            listas.map((lista, i) => {
              return (
                <Fragment key={lista.id}>
                <Col xs={12}>
                  <Card key={lista.id} style={{ margin: "2px" }}>
                    <CardHead>
                      <Col xs={5}>
                        <h4 style={{ margin: "0px" }}>
                          <b>{lista.title}</b>
                        </h4>
                      </Col>
                      <ProgressBar 
                          numQuestions={lista.questionsCount}
                          numQuestionsCompleted={lista.questionsCompletedSumissionsCount}
                          dateBegin={lista.classHasListQuestion.createdAt}
                          dateEnd={lista.classHasListQuestion.submissionDeadline}
                      />
                      <CardOptions>
                        <Link
                          to={`/professor/turma/${this.props.match.params.id}/lista/${lista.id}`}
                        >
                          <button className="btn btn-success mr-2">
                            Acessar <i className="fa fa-wpexplorer" />
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.removerLista(lista)}
                        >
                          <i className="fa fa-trash " />
                        </button>
                      </CardOptions>
                    </CardHead>
                  </Card>
                </Col>
                </Fragment>
              );
            })
          )}
        </Row>

        <Modal
          show={showModalListas}
          onHide={this.handleCloseshowModalListas.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Listas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Fragment>
              <Row mb={15}>
                <div className=" col-12">
                  <InputGroup
                    placeholder={`Perquise pelo ${
                      fieldFilter === "title"
                        ? "Nome"
                        : fieldFilter === "code"
                        ? "Código"
                        : "..."
                    }`}
                    value={contentInputSeach}
                    handleContentInputSeach={this.handleContentInputSeach.bind(
                      this
                    )}
                    filterSeash={this.filterSeash.bind(this)}
                    handleSelect={this.handleSelectFieldFilter.bind(this)}
                    options={[
                      { value: "title", content: "Nome" },
                      { value: "code", content: "Código" }
                    ]}
                    clearContentInputSeach={this.clearContentInputSeach.bind(
                      this
                    )}
                    loading={loandingTodasListas}
                  />
                </div>
              </Row>
              <div className="row">
                {loandingTodasListas ? (
                  <div className="loader" style={{ margin: "0px auto" }} />
                ) : (
                  todasListas.map((lista, index) => (
                    <div key={index} className="col-12">
                      <Card>
                        <CardHead>
                          <CardTitle>
                            {`${lista.title} - ${lista.code}`}
                          </CardTitle>
                          <CardOptions>
                            <div
                              className="btn-group  float-right"
                              role="group"
                              aria-label="Exemplo básico"
                            >
                              <button
                                className="btn-primary btn"
                                onClick={() => this.inserirLista(lista)}
                              >
                                Adicionar
                              </button>
                              <button
                                className="btn btn-primary"
                                data-toggle="collapse"
                                data-target={"#collapse" + lista.id}
                                style={{ position: "relative" }}
                              >
                                <i className="fe fe-chevron-down" />
                              </button>
                            </div>
                          </CardOptions>
                        </CardHead>
                        <div className="collapse" id={"collapse" + lista.id}>
                          <CardBody>
                            <b>Questões: </b> <br />
                            <br />
                            {lista.questions.map((questoes, index) => (
                              <div key={index}>
                                <p>{index + 1 + " - " + questoes.title}</p>
                              </div>
                            ))}
                          </CardBody>
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </div>
              <div className="row">
                <div className="col-12 text-center">
                  <NavPagination
                    totalPages={totalPages}
                    pageAtual={numPageAtual}
                    handlePage={this.handlePage.bind(this)}
                  />
                </div>
              </div>
            </Fragment>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={this.handleCloseshowModalListas.bind(this)}
            >
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showModalDate}
          onHide={this.handleCloseShowModalDate.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title">
              {`Adicionar data limite para as submissões na lista '${list.title}'`} 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={12} textCenter>
                <input type='date' onChange={(e)=>this.changeDate(e)}/> - 23:59:59
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              className={`btn btn-primary ${loadingDateLimit && 'btn-loading'}`}
              onClick={()=>this.addDateLimit(list)}
            >
              Adicionar
            </button>
            <button
              className={`btn btn-danger  ${loadingDateLimit && 'btn-loading'}`}
              onClick={this.handleCloseShowModalDate.bind(this)}
            >
              Não adicionar data limite
            </button>
          </Modal.Footer>
        </Modal>


      </TemplateSistema>
    );
  }
}
