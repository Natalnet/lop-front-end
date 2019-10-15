/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";
import api from '../../../services/api'
import Swal from 'sweetalert2'

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import NavPagination from "components/ui/navs/navPagination";
import socket from 'socket.io-client'

export default class HomeAlunoScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      numPageTurmasAbertas:1,
      turmasAbertas:[],
      totalPages:0,
      turmasSolicitadas:[],
      loandingTurmasAbertas:false,
      descriptions:[]

    }
    this.handlePage=this.handlePage.bind(this)
  }
  async componentDidMount() {
    await this.getTurmasSolicitadas()
    await this.getTurmasAbertas()
    this.getTurmasAbertasRealTime()
    document.title = "Início | LoP";
  }
  async getTurmasSolicitadas(loading=true){
    try{
      if(loading) this.setState({loandingTurmasAbertas:true})
      const response = await api.get('/user/solicitation/classes')
      console.log('turmas solicitdas');
      console.log(response.data);
      this.setState({
        turmasSolicitadas:[...response.data],
        //loandingTurmasAbertas:false
      })
    }
    catch(err){
      this.setState({loandingTurmasAbertas:false})
      console.log(err);
    }
  }
  async getTurmasAbertas(loading=true){
    try{
      if(loading) this.setState({loandingTurmasAbertas:true})
      const response = await api.get(`/class/open/page/${this.state.numPageTurmasAbertas}`)
      console.log('turmas abertas:');
      console.log(response.data.docs);
      this.setState({
        turmasAbertas : response.data.docs,
        totalTumasAbertas : response.data.total,
        totalPages : response.data.totalPages,
        loandingTurmasAbertas:false
      })
    }
    catch(err){
      this.setState({loandingTurmasAbertas:false})
      console.log(err);
    }
  }
  async getTurmasAbertasRealTime(){
    const io = socket("http://localhost:3001")
    console.log('id do usuario');
    console.log(sessionStorage.getItem('user.id'));
    io.emit('connectRoonMyRequestsClass',sessionStorage.getItem('user.id'))
    io.on('MyRequestsClass',async response=>{
      await this.getTurmasSolicitadas(false)
      this.getTurmasAbertas(false)
    })
  }
  async handlePage(e,numPage){
    e.preventDefault()
    console.log(numPage);
    await this.setState({numPageTurmasAbertas:numPage})
    this.getTurmasAbertas()
  }
  async solicitarAcesso(idClass){

    try{
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title:'Processando solicitação',
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.post(`/user/solicit/class/${idClass}`)
      console.log('solicitação:');
      console.log(response.data);
      await this.getTurmasSolicitadas(false)
      this.getTurmasAbertas(false)
      
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Solicitação feita com sucesso!',
      })
      //this.setState({solicitando:''})
    }
    catch(err){
      Swal.hideLoading()

      Swal.fire({
          type: 'error',
          title: 'ops... Falha ao tentar fazer solicitação',
      })
      //this.setState({solicitando:''})
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
  async cancelarSolicitacao(idTurma){
    const idUser = sessionStorage.getItem('user.id')
    try{
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title:'Cancelando Solicitação',
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.delete(`/user/removeSolicitation/class/${idTurma}`)
      await this.getTurmasSolicitadas(false)
      this.getTurmasAbertas(false)
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Solicitação cancelada!',
      })
      //console.log(response);

      await this.setState({solicitando:''})
    }
    catch(err){
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Erro ao cancelar solicitação',
      })
      //this.setState({solicitando:''})

    } 
  }

  render() {
    const {totalPages,numPageTurmasAbertas,turmasSolicitadas,turmasAbertas,loandingTurmasAbertas,descriptions} = this.state
    const range = num => {
        let arr =[]
        for(let i=0;i<num;i++) arr.push(i);
        return arr
    }
    return (
      <TemplateSistema active='turmasAbertas'>
        <div className='row'>
        {loandingTurmasAbertas?
          range(8).map((i) => (
              <div key={i} className="col-6">
                  <br></br>
                  <Card>
                      <CardHead></CardHead>
                      <CardBody loading></CardBody>
                  </Card>
              </div>
          ))
        :
          turmasAbertas.map((turma, index) => {
            /*let jaSolicitou = false
            for(let solicitacao of turmasSolicitadas){
              if(solicitacao.id===turma.id){
                jaSolicitou = true
                break;
              }
            }*/
          return(
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
                                    {
                                     turmasSolicitadas.map(t=>t.id).includes(turma.id)
                                    ?
                                     <button onClick={()=>this.cancelarSolicitacao(turma.id)} className="btn btn-danger" style={{float: "right"}}>
                                      Cancelar solicitação <i className="fa fa-users" /> -
                                     </button>
                                     :
                                     <button onClick={()=>this.solicitarAcesso(turma.id)} className="btn btn-primary" style={{float: "right"}}>
                                      Solicitar Acesso <i className="fa fa-users" /> +
                                     </button>
                                    }
                                </CardFooter>   
                            </Card>
                    </div>
                
            )}
          )
        }
        </div>
        <div className='row'>
          <div className='col-12 text-center'>
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageTurmasAbertas}
              handlePage={this.handlePage}
            />
          </div>
        </div>
      </TemplateSistema>
    );
  }
}
