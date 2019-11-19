import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Swal from 'sweetalert2'
import socket from 'socket.io-client'
import api from '../../../services/api'
const lista = {
    backgroundColor:"white"
};
export default class Pagina extends Component {

    constructor(props){
      super(props)
      this.state = {
        solicitacoes: [],
        loading:false,
        loadingUsers:true,
        loadingInfoTurma:true,
        turma:JSON.parse(sessionStorage.getItem('turma')) || '',
      };
    }
    async componentDidMount() {
        this.getSolicitacoes()
        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - Solicitações`;
        this.getSolicitacoesRealTime()
    }
     async getInfoTurma(){
        const id = this.props.match.params.id
        const {turma} = this.state
        if(!turma || (turma && turma.id!==id)){
            console.log('dentro do if');
            try{
                const response = await api.get(`/class/${id}`)
                const turmaData = {
                    id:response.data.id,
                    name:response.data.name,
                    year:response.data.year,
                    semester:response.data.semester,
                    languages:response.data.languages
                }
                this.setState({
                    turma:turmaData,
                    loadingInfoTurma:false,
                })
                sessionStorage.setItem('turma',JSON.stringify(turmaData))
            }
            catch(err){
                this.setState({loadingInfoTurma:false})
                console.log(err);
            }
        }
        else{
            this.setState({loadingInfoTurma:false})
        }
    }
    async getSolicitacoes(loadingResponse=true){
        const id = this.props.match.params.id
        try{
            if(loadingResponse) this.setState({loading:true})
            const response = await api.get(`/solicitation/class/${id}`)
            console.log('solicitações')
            console.log(response.data);
            this.setState({
                solicitacoes:[...response.data],
                loading:false,
                loadingUsers:false
            })
        }
        catch(err){
            this.setState({
                loading:false,
                loadingUsers:false
            })
            console.log(err);
        }
    }
    getSolicitacoesRealTime(){
        const io = socket("http://localhost:3001")
        const id = this.props.match.params.id
        io.emit('connectRoonRequestClass',id)//conectando à sala
        io.on('RequestsClass',response=>{
            this.getSolicitacoes(false)
        })
    }
    async aceitaSolicitacao(idUser){
        const idTurma = this.props.match.params.id
        try{
          Swal.fire({
            title:'Processando',
            allowOutsideClick:false,
            allowEscapeKey:false,
            allowEnterKey:false
          })
          Swal.showLoading()
          const response = await api.post(`/solicitation/class/${idTurma}/user/${idUser}/store`)
          //console.log(response);
          await this.removeSolicitacao(idUser)
          this.getSolicitacoes()
          Swal.hideLoading()
          Swal.fire({
              type: 'success',
              title: 'Usuário adicionado á turma com sucesso!',
          })
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Usuário não pôde ser adicionado',
          })
        } 
    }

    async removeSolicitacao(idUser){
        const idTurma = this.props.match.params.id
        try{
          Swal.fire({
            title:'Processando',
            allowOutsideClick:false,
            allowEscapeKey:false,
            allowEnterKey:false
          })
          Swal.showLoading()
          const response = await api.delete(`/solicitation/${idTurma}/user/${idUser}/delete`)
          console.log(response.data);
          this.getSolicitacoes()
          Swal.hideLoading()
          Swal.fire({
              type: 'success',
              title: 'Solicitação rejeitada com sucesso!',
          })
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Solicitação não pôde ser removida',
          })
        } 
    }
    render() {
        const {solicitacoes,loadingUsers,turma,loadingInfoTurma}=this.state
        return (
            <TemplateSistema {...this.props} active={'solicitações'} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                        }
                    </div>
                </div>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                    <table style={lista} className="table table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>email</th>
                                <th>Matrícula</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingUsers
                            ?
                                <tr>
                                    <td>
                                        <div className="loader" />
                                    </td>
                                    <td>                                        
                                        <div className="loader" />
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>                                        
                                    <td>
                                        <div className="loader"/>
                                    </td>


                                </tr>           
                            :
                                solicitacoes.map((user,i)=>(
                                <tr key={i}>
                                    <td className='text-center'>
                                        <div 
                                            className="avatar d-block" 
                                            style={
                                                {backgroundImage: `url(${user.urlImage || 'https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg'})`}
                                            }
                                        />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.enrollment}</td>
                                    <td>
                                        <button onClick={()=>this.aceitaSolicitacao(user.id)} className="btn btn-success mr-2">
                                            <i className="fa fa-user-plus"/>
                                        </button>
                                        <button onClick={()=> this.removeSolicitacao(user.id)} className="btn btn-danger mr-2">
                                            <i className="fa fa-user-times" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </TemplateSistema>
        )
    }
}