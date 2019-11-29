import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";
import Error404 from "screens/erros/error404.screen";

import { Redirect } from "react-router-dom";

import Swal from "sweetalert2";

import api from "../../services/api";
import LogoLOP from "components/ui/logoLOP.component";

export default class resetScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      redirectLogin: false,
      msg: "",
      password: "",
      loading:false,
      confirmpassword: "",
      error: false
    };
  }
  componentDidMount(){
    document.title = "Recuperar Senha - Plataforma LOP";
  }
  async send(e){
    e.preventDefault();

    if (this.state.password === "") {
      this.setState({ msg: "Informe a nova senha", error: true });
    } else if (this.state.confirmpassword === "") {
      this.setState({
        msg: "Informe a confirmação da nova senha",
        error: true
      });
    } else if (this.state.password !== this.state.confirmpassword) {
      this.setState({
        msg: "A nova senha e sua confirmação não correspondem",
        error: true
      });
    } else {
      const request = {
        password: this.state.password
      };
      const key = this.props.location.search;
      try{
        this.setState({loading:true})
        await api.put(`/auth/resetpassword${key}`, request)
        this.setState({
          loading:false,
          msg:'',
          error:false
        })
        Swal.fire({
          type: "success",
          title: `Congratulations`,
          text: `Senha alterada com sucesso.`,
          confirmButtonText: "Voltar para tela de Login",
          allowOutsideClick:false,
          allowEscapeKey:false,
          allowEnterKey:false 
        }).then(result => {
          if (result.value) {
            return this.setState({ redirect: true });
          }
        })
      }
      catch(err){
        console.log(Object.getOwnPropertyDescriptors(err))
        this.setState({
          loading:false,
          error:true,
          msg:false
        })
        if(err.message==='Request failed with status code 400'){
          this.setState({msg:err.response.data.msg})
          Swal.fire({
            type: "error",
            title: `Ops...`,
            text: err.response.data.msg,
            confirmButtonText: "Ir para tela de 'recuperar senha'",
            allowOutsideClick:false,
            allowEscapeKey:false,
            allowEnterKey:false 
          }).then(result => {
            if (result.value) {
              return this.setState({ redirectLogin: true });
            }
          });
        }
        else{
          this.setState({msg:'Falha na conexão com o servidor :('})
        }
      }
    }
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (this.state.redirectLogin) {
      return <Redirect to="/autenticacao/recuperar-senha" />;
    }
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    console.log(this.props);
    const {msg,error,password,confirmpassword,loading} = this.state
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={(e) => this.send(e)}>
          <div className="card-body p-6">
            <LogoLOP />
            <div className="card-title">Restauração de Senha</div>
            <span
              className={`alert-${error ? "danger" : "success"}`}
            >
              {msg}
            </span>
            <div className="form-group">
              <label className="form-label">Digite sua nova senha</label>
              <input
                type="password"
                name="password"
                className={`form-control ${error && 'is-invalid'}`}
                placeholder="****"
                value={password}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirme sua senha</label>
              <input
                type="password"
                name="confirmpassword"
                className={`form-control ${error && 'is-invalid'}`}
                placeholder="****"
                value={this.state.confirmpassword}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-footer">
              <button type="submit" className={`btn btn-primary btn-block ${loading && 'btn-loading'}`}>
                Enviar
              </button>
            </div>
          </div>
        </form>
        <br />
      </TemplateAutenticacao>
    );
  }
}
