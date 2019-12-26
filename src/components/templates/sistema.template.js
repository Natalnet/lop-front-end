/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component, createRef } from "react";

import api from "../../services/api"

import ErrorBoundary from "screens/erros/errorBoundary.screen";

import HeadPefilMenu from "components/menus/comum/headPerfil.menu";

import MenuAluno from "components/menus/dashboard/aluno/menuAluno.menu";

import MenuAdministrador from "components/menus/dashboard/administrador/menuAdministrador.menu";

import MenuProfessor from "components/menus/dashboard/professor/menuProfessor.menu";

//import { perfis } from "config/enums/perfis.enum";

export default class TemplateSistema extends Component {
  constructor(props) {
    super(props);
    this.height = createRef() 

  }

  componentDidMount() {
    document.title = "Plaforma Lop";
    this.handleAxiosErros();
  }

  handleAxiosErros = () => {
    api.interceptors.response.use(null, err => {
        console.log("interceptores------>>>>>>")
        console.log(Object.getOwnPropertyDescriptors(err))
        console.log(err.message)
        console.log("interceptores------>>>>>>")
        
          if ((err.response && err.response.status === 404) || err.message==="Network Error") {
                this.props.history.push('/404')
          } 
          else if(err.response && err.response.status === 401){
            this.props.history.push(`/${sessionStorage.getItem('user.profile').toLocaleLowerCase()}`)
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
            <div className="my-3 my-md-5">
              <div className="container">
                {this.props.children}
              </div>
            </div>
          </div>
          {/* {this.footer()} */}
          <footer className="footer">
            <div className="container">
              <div style={{textAlign:"center"}}> 
              Plataforma LOP. Universidade Federal do Rio Grande do Norte
                  2019.
              </div>
            </div>
       </footer>
        </div>
      </ErrorBoundary>
    );
  }
}
