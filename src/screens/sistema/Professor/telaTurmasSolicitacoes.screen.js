import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import Swal from 'sweetalert2'

import api from '../../../services/api'
import SubMenu from '../../../components/menus/dashboard/professor/subMenuTurma.menu'
const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};
export default class Pagina extends Component {

    constructor(props){
      super(props)
      this.state = {
        requestsUsers: [],
        loading:false,
        loadingUsers:true,
        loadingInfoTurma:true,
        turma:''
      };
    }
    componentDidMount() {
        this.getInfoTurma()
        this.getRequests()
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        try{
            const response = await api.get(`/class/${id}`)
            console.log(response);
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
    async getRequests(){
        const id = this.props.match.params.id
        try{
            this.setState({loading:true})
            const response = await api.get(`/class/${id}/requests`)
            console.log(response);
            this.setState({
                requestsUsers:response.data,
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
          const response = await api.put(`/class/${idTurma}/acceptRequest/user/${idUser}`)
          console.log(response);
          this.getRequests()
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

    async regeitarSolicitacao(idUser){
        const idTurma = this.props.match.params.id
        try{
          Swal.fire({
            title:'Processando',
            allowOutsideClick:false,
            allowEscapeKey:false,
            allowEnterKey:false
          })
          Swal.showLoading()
          const response = await api.put(`/class/${idTurma}/rejectRequest/user/${idUser}`)
          console.log(response);
          this.getRequests()
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
        const {requestsUsers,loading,loadingUsers,turma,loadingInfoTurma}=this.state
        return (
            <TemplateSistema {...this.props} active={'solicitações'} submenu={'telaTurmas'}>
                {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
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
                            requestsUsers.map((user,i)=>(
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
                                    <button onClick={()=>this.aceitaSolicitacao(user._id)} className="btn btn-success mr-2">
                                        <i className="fa fa-user-plus"/>
                                    </button>
                                    <button onClick={()=> this.regeitarSolicitacao(user._id)} className="btn btn-danger mr-2">
                                        <i className="fa fa-user-times" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> 
            </TemplateSistema>
        )
    }
}