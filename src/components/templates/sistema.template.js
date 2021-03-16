/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component,createRef } from "react";

import api from "../../services/api"

import ErrorBoundary from"../../screens/erros/errorBoundary.screen";

import HeadPefilMenu from "../menus/comum/headPerfil.menu";

import MenuAluno from "../menus/dashboard/aluno/menuAluno.menu";

import MenuAdministrador from "../menus/dashboard/administrador/menuAdministrador.menu";

import MenuProfessor from "../menus/dashboard/professor/menuProfessor.menu";

//import { perfis } from "config/enums/perfis.enum";

const containerStyle = {
  minHeight: "calc(100vh - 230px)"
}
export default class TemplateSistema extends Component {
  constructor(props) {
    super(props);
    this.height = createRef()
  }
  
  componentDidMount() {
    document.title = "Plataforma Lop";
    this.handleAxiosErros();
  }

  handleAxiosErros = () => {
    const profile = sessionStorage.getItem("user.profile");
    api.interceptors.response.use(null, err => {
      console.log("interceptores------>>>>>>")
      console.log(Object.getOwnPropertyDescriptors(err))
      console.log(err.message)
      console.log("interceptores------>>>>>>")
      
      if ((err.response && err.response.status === 404) || err.message==="Network Error") {
        // this.props.history.push('/404')
      } 
      else if(err.response && err.response.status === 401){
        console.log("props:",this.props)
        if(err.response.data.msg==="token mal formatado" ){
          sessionStorage.clear()
          document.location.href = '/'
        }
        else if(err.response.data.msg==="perfil inválido"){
          sessionStorage.clear()
          document.location.href = '/'
        }
        else{
          document.location.href = `/${profile && profile.toLocaleLowerCase()}`
        }
      }
      else {
        return Promise.reject(err);
      }
        
    });
  };

  

  // footer(){
  //   const teste = this.height.current
  //   const teste2 = teste && teste.offsetHeight
  //   console.log(teste2)
  //   if(teste2>=180){
  //     return(
  //       <footer className="footer">
  //         <div className="container">
  //           <div style={{textAlign:"center"}}> 
  //           Plataforma LOP. Universidade Federal do Rio Grande do Norte
  //               2019.
  //           </div>
  //         </div>
  //       </footer>
  //     );
  //   }
  //   else{
  //     return(
  //       <footer className="footer" style={{position:'absolute', bottom:'0px', width:'100%'}}>
  //         <div className="container">
  //           <div style={{textAlign:"center"}}> 
  //           Plataforma LOP. Universidade Federal do Rio Grande do Norte
  //               2019.
  //           </div>
  //         </div>
  //       </footer>
  //     );
  //   }
  // }

  render() {

    return (
      <ErrorBoundary>
        <div className="page">
          <div className="page-main" ref={this.height}>
            <div className="header py-4">
              <div className="container">
                <HeadPefilMenu />
              </div>
            </div>
            {sessionStorage.getItem('user.profile')==='ALUNO'?<MenuAluno {...this.props}/>:null}
            {sessionStorage.getItem('user.profile')==='PROFESSOR'?<MenuProfessor {...this.props}/>:null}
            {sessionStorage.getItem('user.profile')==='ADMINISTRADOR'?<MenuAdministrador {...this.props}/>:null}
            
            <div className="my-3 my-md-5" style={containerStyle}>
              <div className="container">
                {this.props.children}
              </div>
            </div>
          </div>
          {/* {this.footer()} */}
          <footer className="footer">
            <div className="container">
              <div style={{textAlign:"center"}}> 
              Plataforma LOP. Universidade Federal do Rio Grande do Norte {new Date().getFullYear()}.
               
              </div>
            </div>
       </footer>
        </div>
      </ErrorBoundary>
    );
  }
}
