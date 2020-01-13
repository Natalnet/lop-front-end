import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import TurmaListaScrren from "components/screens/turmaLista.componente.screen" 

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lista: null,
      loandingLista: true,
      showModalDate:false,
      loadingInfoTurma: true,
      loadingDateLimit:false,
      dateLimit:'',
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",        
      todasListas: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getLista();
    const {turma,lista} = this.state
    document.title = `${turma && turma.name} - ${lista && lista.title}`;
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
  async getLista() {
    try {
      const idClass = this.props.match.params.id;
      const idLista = this.props.match.params.idLista;
      let query = `?idClass=${idClass}`
      const response = await api.get(
        `/listQuestion/${idLista}${query}`
      );
      console.log("lista");
      console.log(response.data);
      const lista = response.data
      let dateLimit = ''
      if(lista.classHasListQuestion.submissionDeadline){
        dateLimit = new Date(lista.classHasListQuestion.submissionDeadline)
        const yarn = dateLimit.getFullYear()
        const month = dateLimit.getMonth()+1
        const day = dateLimit.getDate()
        dateLimit = `${yarn}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
      }
      console.log('dateLimit');
      console.log(dateLimit);
      this.setState({
        lista,
        dateLimit,
        loandingLista: false
      });
    } catch (err) {
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
        this.handleCloseShowModalDate()
        this.setState({loadingDateLimit:false})
        this.getLista()
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
  handleShowModalDate(){
      this.setState({
          showModalDate:true,
      })
  }
  handleCloseShowModalDate(e){
      this.setState({showModalDate:false})
  }
  render() {
    const { loadingInfoTurma, turma,loadingDateLimit,showModalDate,dateLimit, loandingLista, lista } = this.state;
    

    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{margin:'0px',display:'inline'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                <i className="fa fa-angle-left ml-2 mr-2"/> 
                <Link to={`/professor/turma/${this.props.match.params.id}/listas`}>
                  Listas
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/>
                {lista?lista.title:<div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
              </h5>
            )}
          </Col>
        </Row>
        <Row mb={15}>
          <Col xs={6}>
            <button
              className={`btn btn-primary ${loandingLista && 'btn-loading'}`}
              onClick={()=>this.handleShowModalDate()}
            >
              {lista && dateLimit?
                'Editar data limite para submissões'
                :
                'Adicionar data limite para submmissões'
              }
            </button>
          </Col>
        </Row>
        {loandingLista ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <TurmaListaScrren
            {...this.props}
            lista={lista}
          />
            <Modal
              show={showModalDate}
              onHide={this.handleCloseShowModalDate.bind(this)}
              size="lg"
              aria-labelledby="contained-modal-title"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title">
                  {`Adicionar data limite para as submissões na lista '${lista && lista.title}'`} 
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={12} textCenter>
                    <input type='date' value={dateLimit} onChange={(e)=>this.changeDate(e)}/> - 23:59:59
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className={`btn btn-primary ${loadingDateLimit && 'btn-loading'}`}
                  onClick={()=>this.addDateLimit(lista)}
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
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
