import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import TurmaProvasScreen from "components/screens/turmaProvas.componente.screen"
import TurmaListasScrren from "../.././../components/screens/turmaListas.componente.screen" 

export default class Listas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listas: [],
      provas: [],
      user: {},
      loandingListas: false,
      loandingProvas: false,
      loadingInfoTurma: true,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",      
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getListas();
    this.getProvas()
    
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
  async getListas() {
    try {
      const {id,idUser} = this.props.match.params;
      let query = `?idClass=${id}`
      query += `&idUser=${idUser}`
      this.setState({ loandingListas: true });
      const response = await api.get(`/listQuestion${query}`);
      console.log("listas");
      console.log(response.data);
      this.setState({
        listas: [...response.data.lists],
        usuario: response.data.user,
        loandingListas: false
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }

  async getProvas() {
    try {
      const {id,idUser} = this.props.match.params;
      let query = `?idClass=${id}`
      query += `&idUser=${idUser}`
      this.setState({ loandingProvas: true });
      const response = await api.get(`/test${query}`);
      console.log("listas");
      console.log(response.data);
      this.setState({
        provas: [...response.data.tests],
        usuario: response.data.user,
        loandingProvas: false
      });
    } catch (err) {
      this.setState({ loandingProvas: false });
      console.log(err);
    }
  }

  render() {
    const {
      loadingInfoTurma,
      turma,
      loandingListas,
      loandingProvas,
      listas,
      provas,
      usuario
    } = this.state;
    return (
      <TemplateSistema
        {...this.props}
        active={"participantes"}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{margin:'0px',display:'inline'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                <i className="fa fa-angle-left ml-2 mr-2"/> 
                <Link to={`/professor/turma/${this.props.match.params.id}/participantes`}>
                  Participantes
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/>
                {usuario?`${usuario.name} `:<div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
              </h5>
            )}
          </Col>
        </Row>
        {loandingListas || loandingProvas? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={10}>
              <Col md={12} textCenter>
                <h4 style={{ margin: "0px" }}>Listas</h4>
              </Col>
            </Row>
            <TurmaListasScrren
              {...this.state}
              {...this.props}
              listas={listas}
              user={usuario}
              participant
            />
            <Row mb={10}>
              <Col md={12} textCenter>
                <h4 style={{ margin: "0px" }}>Provas</h4>
              </Col>
            </Row>
            <TurmaProvasScreen
              {...this.state}
              {...this.props}
              provas={provas}
              user={usuario}
              participant
            />
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
