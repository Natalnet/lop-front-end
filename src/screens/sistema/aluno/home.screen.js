/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";
import api from '../../../services/api'
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardBody from "components/ui/card/cardBody.component";
export default class HomeAlunoScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      minhasTurmas:[],
      loadingMinhasTurmas:false,

    }
    //this.handlePage=this.handlePage.bind(this)
  }
 
  componentDidMount() {
    this.getInfoUser()
    document.title = "Sistema Aluno - Plataforma LOP";
  }
  async getInfoUser(){
    try{
      //this.setState({loadingMinhasTurmas:true})
      const response = await api.get('/user/info/profile')
      console.log('user:');
      console.log(response.data)
      this.setState({
        minhasTurmas:response.data.classes,
        //turmasSolicitadas:response.data.requestedClasses,
        //loadingMinhasTurmas:false
      })
    }
    catch(err){
      this.setState({loadingMinhasTurmas:false})
      console.log(err);
    }
  }

  render() {
    const {minhasTurmas} = this.state
    return (
      <TemplateSistema>
        <div className='row'>
          {minhasTurmas.map((turma, index) => (
            <div key={index} className="col-6">
              <Card>
                  <CardHead>Nome: {turma.name}</CardHead>
                  <CardBody>
                      <h5 className="">Ano: {turma.year}.2{turma.semester}</h5>
                      <hr></hr>
                      <p className="card-text">Descrição: {turma.description}</p>
                      <a href={`/aluno/turma/${turma._id}/participantes`} className="btn btn-primary">Entrar</a>
                  </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </TemplateSistema>
    );
  }
}
