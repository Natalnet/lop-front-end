import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";

export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
      turma:"",        
      loadingInfoTurma: true
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
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
  render() {
    const { loadingInfoTurma, turma } = this.state;
    return (
      <TemplateSistema
        {...this.props}
        active={"dashboard"}
        submenu={"telaTurmas"}
      >
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
      </TemplateSistema>
    );
  }
}
