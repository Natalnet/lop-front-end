/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";
import {Link} from 'react-router-dom';

import api from '../../../services/api'
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
export default class HomeAlunoScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      minhasTurmas:[],
      loadingTurmas:false,
      descriptions:[]

    }
    //this.handlePage=this.handlePage.bind(this)
  }
 
  componentDidMount() {
    this.getInfoUser()
    document.title = "Sistema Aluno - Plataforma LOP";
  }
  async getInfoUser(){
    try{
      this.setState({loadingTurmas:true})
      const response = await api.get('/user/classes')
      console.log('minhas turmas');
      console.log(response.data)
      this.setState({
        minhasTurmas:[...response.data],
        loadingTurmas:false
      })
    }
    catch(err){
      this.setState({loadingTurmas:false})
      console.log(err);
    }
  }
  async handleShowDescription(id){
    console.log('descriptions');
    const {descriptions} = this.state
    const index = descriptions.indexOf(id)
    if(index==-1){
      await this.setState({descriptions:[id,...descriptions]})
    }
    else{
      await this.setState({descriptions:[...descriptions.filter((desc,i)=>i!=index)]})
    }
  }

  render() {
    const {minhasTurmas,loadingTurmas,descriptions} = this.state
    return (
      <TemplateSistema active='home'>
        <div className='row'>
              {loadingTurmas?
                  <div className="loader"  style={{margin:'0px auto'}}></div>
              :
                  minhasTurmas.map((turma, index) => (
                      <div key={index} className="col-6">
                          <br></br>
                          <Card>
                            <CardHead>
                              <CardTitle>
                                <i className="fa fa-users" /><b> {turma.name} - {turma.year}.{turma.semester || 1}</b>
                              </CardTitle>
                              <CardOptions>
                                <i
                                  title='Ver descrição'
                                  style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                                  className={`fa fa-info-circle`} 
                                  onClick={(e)=>this.handleShowDescription(turma.id)}
                                  data-toggle="collapse" data-target={'#collapse'+turma.id} 
                                  aria-expanded={descriptions.includes(turma.id)}
                                />
                              </CardOptions>
                              </CardHead>

                                <div className="collapse" id={'collapse'+turma.id}>
                                    <CardBody>
                                        {turma.description}
                                    </CardBody>
                                </div>
                                
                                <CardFooter>
                                    <Link to={`/aluno/turma/${turma.id}/dashboard`} style={{float: "right",}} className="btn btn-primary mr-2">
                                        <i className="fe fe-corner-down-right" /> Entrar
                                    </Link>
                                </CardFooter>
                                
                            </Card>
                        </div>
                    ))
                }
        </div>
      </TemplateSistema>
    );
  }
}
