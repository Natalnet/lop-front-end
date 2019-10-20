import React, { Component } from "react";
import api from '../../../services/api'
import AdministracaoTemplate from "components/templates/administracao.template";
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Swal from 'sweetalert2'

export default class HomeAdministradorScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      users : [],
      loadingUsers : false,
      numPageAtual:1,
      totalItens:0,
      totalPages:0,
      contentInputSeach:'',
      fieldFilter:'name',
    }
  }
  componentDidMount() {
    this.getUsers()
    document.title = "Administração - Plataforma LOP";
  }
  async getUsers(){
    const {numPageAtual,contentInputSeach,fieldFilter} = this.state
    let query = `include=${contentInputSeach.trim()}`
    query += `&field=${fieldFilter}`
    try{
      this.setState({loadingUsers:true})

      const response = await api.get(`user/page/${numPageAtual}?${query}`)
      console.log('users');
      console.log(response.data.docs);
      this.setState({
          users:[...response.data.docs],
          totalItens : response.data.total,
          totalPages : response.data.totalPages,
          loadingUsers:false
      })
    }
    catch(err){
      this.setState({loadingUsers:false})
    }
  }
  async handleProfileUser(e,user){
    user.profile = e.target.value
    const request = {
      user:user
    }
    try{
      Swal.fire({
        title:'Processando troca de perfil...',
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.put(`/user/${user.id}/update`,request)
      this.setState({
        users:this.state.users.map(u=>{
          if(u.id===user.id){
            return user
          }
          return u
        })
      })
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
      })
    }
    catch(err){
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Perfil não pôde ser atualizado :(',
      })
      console.log(err);
    }
  }
  handlePage(e,numPage){
    e.preventDefault()
      //console.log(numPage);
    this.setState({
        numPageAtual:numPage
    },()=>this.getUsers())
  }
    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getUsers()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getUsers()*/)
    }
    filterSeash(){
        this.getUsers()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getUsers()) 
    }
  
  render() {
    const {users,loadingUsers,numPageAtual,totalItens,totalPages,contentInputSeach,fieldFilter} = this.state
    return (
      <AdministracaoTemplate active="home">
        <div className='row'>
          <div className="col-12">     
              <InputGroup
                  placeholder={`Perquise pelo ${fieldFilter==='name'?'Nome':fieldFilter==='email'?'Email':'...'}`}
                  value={contentInputSeach}
                  handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                  filterSeash={this.filterSeash.bind(this)}
                  handleSelect={this.handleSelectFieldFilter.bind(this)}
                  options={ [{value:'name',content:'Nome'},{value:'email',content:'Email'}] }
                  clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                  loading={loadingUsers}                            
              />
          </div>
        </div>
        <br/>

        <table className="table table-hover" style={{backgroundColor:"white"}}>
           <thead>
               <tr>
                   <th></th>
                   <th>Nome</th>
                   <th>Email</th>
                   <th>Matrícula</th>
                   <th>Função</th>
               </tr>
           </thead>
           <tbody>
          {loadingUsers?
            <tr>
                <td>
                    <div className="loader" />
                </td>
                <td>
                    <div className="loader" />
                </td>
                <td>
                    <div className="loader" />
                </td>
                <td>
                    <div className="loader" />
                </td>
            </tr>               
          :
            users.map(user => (
              <tr key={user.id}>
                <td>
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
                  {user.id===sessionStorage.getItem('user.id')?
                    <select
                        disabled
                        className="form-control" 
                        defaultValue={user.profile} 
                        onChange={(e)=>this.handleProfileUser(e,user)}
                    >
                      <option >{user.profile}</option>
                    </select>
                  :
                    <select 
                        className="form-control" 
                        defaultValue={user.profile} 
                        onChange={(e)=>this.handleProfileUser(e,user)}
                    >
                      <option value='ADMINISTRADOR'>ADMINISTRADOR</option>
                      <option value='ALUNO'>ALUNO</option>
                      <option value='PROFESSOR'>PROFESSOR</option>
                    </select>
                  }
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
          <div className='row'>
            <div className='col-12 text-center'>
              <NavPagination
                totalPages={totalPages}
                pageAtual={numPageAtual}
                handlePage={this.handlePage}
              />
            </div>
          </div>
      </AdministracaoTemplate>
    );
  }
}