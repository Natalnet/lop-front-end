import React, { Component } from "react";

import api from "../../services/api"

import ErrorBoundary from"../../screens/erros/errorBoundary.screen";

import HeadPefilMenu from "../../components/menus/comum/headPerfil.menu";
import MenuAdministrador from "../../components/menus/dashboard/administrador/menuAdministrador.menu";

export default class TemplateSistema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erros: [],
      keyErros: 0
    };
  }
  componentDidMount() {
    document.title = "Adiministração";
  }
  handleAxiosErros = () => {
    const profile = sessionStorage.getItem("user.profile");
    api.interceptors.response.use(null, err => {
      console.log("interceptores------>>>>>>")
      console.log(Object.getOwnPropertyDescriptors(err))
      console.log(err.message)
      console.log("interceptores------>>>>>>")
      
      if ((err.response && err.response.status === 404) || err.message==="Network Error") {
        this.props.history.push('/404')
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

  render() {
    return (
      <ErrorBoundary>
        <div className="page">
          <div className="page-main">
            <div className="header py-4">
              <div className="container">
                <HeadPefilMenu />
              </div>
            </div>
            <MenuAdministrador {...this.props} />
            <div className="my-3 my-md-5 ">
              <div className="container">{this.props.children}</div>
            </div>
          </div>
          <footer className="footer">
            <div className="container">
              <div style={{ textAlign: "center" }}>
                Plataforma LOP. Universidade Federal do Rio Grande do Norte {new Date().getFullYear()}.
                
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    );
  }
}
