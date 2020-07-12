import React, { Component } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import TurmaProvasScreen from "components/screens/turmaProvas.componente.screen";
import TurmaListasScrren from "../.././../components/screens/turmaListas.componente.screen";

export default class Listas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listas: [],
      provas: [],
      users: [],
      user: {},

      loandingListas: true,
      loandingProvas: true,
      loadingUsers : true,
      loadingInfoTurma: true,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
    };
  }
  async componentDidMount() {
    await this.getInfoTurma();
    this.getUsersByClasse();
    this.getUserLists(this.props.match.params.idUser);
    this.getUserTests(this.props.match.params.idUser);

    const { turma } = this.state;
    document.title = `${turma && turma.name} - listas`;
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { myClasses } = this.state;
    if (myClasses && typeof myClasses === "object") {
      const index = myClasses.map((c) => c.id).indexOf(id);
      if (index !== -1) {
        this.setState({
          turma: myClasses[index],
        });
      }
      this.setState({ loadingInfoTurma: false });
      return null;
    }
    try {
      const response = await api.get(`/class/${id}`);
      this.setState({
        turma: response.data,
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }
  async getUsersByClasse(){
    this.setState({loadingUsers:true})
    const id = this.props.match.params.id;
    try{
      const response = await api.get(`/user/class/${id}`)
      //console.log('users: ',response.data);
      this.setState({
        users: response.data,
        loadingUsers: false
      })
    }
    catch(err){
      console.log(err)
    }
  }
  async getUserLists(idUser) {
    try {
      const { id } = this.props.match.params;
      let query = `?idClass=${id}`;
      query += `&idUser=${idUser}`;
      this.setState({ loandingListas: true });
      const response = await api.get(`/listQuestion${query}`);
      this.setState({
        listas: [...response.data.lists],
        usuario: response.data.user,
        loandingListas: false,
      });
    } catch (err) {
      this.setState({ loandingListas: false });
      console.log(err);
    }
  }

  async getUserTests(idUser) {
    try {
      const { id } = this.props.match.params;
      let query = `?idClass=${id}`;
      query += `&idUser=${idUser}`;
      this.setState({ loandingProvas: true });
      const response = await api.get(`/test${query}`);
      this.setState({
        provas: [...response.data.tests],
        usuario: response.data.user,
        loandingProvas: false,
      });
    } catch (err) {
      this.setState({ loandingProvas: false });
      console.log(err);
    }
  }

  getCurretIndexUser(){
    const { users } = this.state;
    const { idUser } = this.props.match.params;
    const currentUser = users.findIndex(user=>user.id ===idUser)
    return currentUser;
  }
  getPrevUser(){
    const { users } = this.state;
    const index = this.getCurretIndexUser();
    const prevUser = users.find((user,i)=>i===index-1)
    //console.log('index: ',index,'prevuser: ',prevUser)
    return prevUser !== -1?prevUser:null;
  }
  getNextUser(){
    const { users } = this.state;
    const index = this.getCurretIndexUser();
    const nextUser = users.find((user,i)=>i===index+1)
    return nextUser !== -1?  nextUser:null;
  }
  handleRedirect(idUser){
    const { id  } = this.props.match.params;
    this.props.history.push(`/professor/turma/${id}/participantes/${idUser}/listas`);
    this.getUserLists(idUser);
    this.getUserTests(idUser)
  }


  render() {
    const {
      loadingInfoTurma,
      turma,
      loandingListas,
      loandingProvas,
      loadingUsers,
      listas,
      provas,
      usuario,
      users,
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
              <h5 style={{ margin: "0px", display: "inline" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" />
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/participantes`}
                >
                  Participantes
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
                {usuario ? (
                  `${usuario.name} `
                ) : (
                  <div
                    style={{
                      width: "140px",
                      backgroundColor: "#e5e5e5",
                      height: "12px",
                      display: "inline-block",
                    }}
                  />
                )}
              </h5>
            )}
          </Col>
        </Row>

        {loadingUsers || loandingListas || loandingProvas?
          <div className="loader" style={{ margin: "0px auto" }}></div>
        :
        <Row mb={15}>
          <Col xs={5}>
            <label htmlFor="selectAluno">Participantes: </label>
            <select
              id="selectAluno"
              className="form-control"
              defaultValue={this.props.match.params.idUser}
              onChange={(e) => this.handleRedirect(e.target.value)}
            >
              {users.map(user=>
                <option
                  key={user.id} 
                  value={user.id}
                  onChange={(e)=>this.handleRedirect(e.target.value)}
                >
                  {user.name} - {user.email}
                </option>
              )}
            </select>
          </Col>
        </Row>
        }

        {loandingListas?
          <div className="loader" style={{ margin: "0px auto" }}></div>
        :
        <>
          <Row mb={15}>
            <Col md={12} textCenter>
              <h4 style={{ margin: "0px" }}>
                {listas.length > 0 && "Listas"}
              </h4>
            </Col>
          </Row>
          <TurmaListasScrren
            {...this.state}
            {...this.props}
            listas={listas}
            user={usuario}
            participant
          />
        </>
        }
        {loandingProvas?
          <div className="loader" style={{ margin: "0px auto" }}></div>
        :
        <>
          <Row mb={10}>
            <Col md={12} textCenter>
              <h4 style={{ margin: "0px" }}>
                {provas.length > 0 && "Provas"}
              </h4>
            </Col>
          </Row>
          <TurmaProvasScreen
            {...this.state}
            {...this.props}
            provas={provas}
            user={usuario}
            participant
          />
        </>
        } 
        <Row mb={15}>
          <Col md={12} >
            <div
              style={{
                width:'100%',
                display:'flex',
                justifyContent:'space-between'
              }}
            >
              <span>
                <button 
                  onClick={()=>this.handleRedirect(this.getPrevUser() && this.getPrevUser().id)}
                  className= {`btn btn-outline-primary ${!this.getPrevUser()?'d-none':''}`}
                >
                  <i className="fa fa-chevron-left mr-2" />
                  {this.getPrevUser() &&  this.getPrevUser().name} - {this.getPrevUser() && this.getPrevUser().email}
                </button>
              </span>
              
              <span>
                <button 
                  onClick={()=>this.handleRedirect(this.getNextUser() && this.getNextUser().id)}
                  className= {`btn btn-outline-primary ${!this.getNextUser()?'d-none':''}`}
                >
                  { this.getNextUser() && this.getNextUser().name} - { this.getNextUser() && this.getNextUser().email}
                  <i className="fa fa-chevron-right ml-2" />
                </button>
              </span>
            </div>
          </Col>
        </Row>       
      </TemplateSistema>
    );
  }
}
