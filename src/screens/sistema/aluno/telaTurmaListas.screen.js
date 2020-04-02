import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api, { baseUrlBackend } from "../../../services/api";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import socket from "socket.io-client";
import TurmaListasScrren from "../.././../components/screens/turmaListas.componente.screen" 

export default class Listas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listas: [],
      loandingListas: true,
      loadingInfoTurma: true,
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",      
    };
  }
  
  async componentDidMount() {
    await this.getInfoTurma();
    this.getListas();
    this.getListasRealTime();
   
    const {turma} = this.state
    document.title = `${turma && turma.name} - listas`;
  }
  componentWillUnmount(){
    this.io && this.io.close();
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
      const id = this.props.match.params.id;
      let query = `?idClass=${id}`
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
  getListasRealTime() {
    this.io = socket(baseUrlBackend);
    this.io.emit("connectRoonClass", this.props.match.params.id);

    this.io.on("addListToClass", response => {
      let { listas } = this.state;
      this.setState({ listas: [...listas, response] });
    });
    this.io.on("removeListFromClass", response => {
      let { listas } = this.state;
      this.setState({
        listas: listas.filter(lista => lista.id !== response.id)
      });
    });
  }
  render() {
    const { loadingInfoTurma, turma, loandingListas, listas } = this.state;
    return (
      <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                <i className="fa fa-angle-left ml-2 mr-2"/> Listas
              </h5>
            )}
          </Col>
        </Row>
        {loandingListas ? (
          <Row mb={15}>
            <div className="loader" style={{ margin: "0px auto" }}></div>
          </Row>
        ) : (
          <TurmaListasScrren
            {...this.state}
            {...this.props}
            listas={listas}
          />
        )
        }
      </TemplateSistema>
    );
  }
}
