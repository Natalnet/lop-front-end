/*
 * @Author: Victor Hermes
 * @Date: 2019-05-18 17:37:20
 *
 */

import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";
import api from "../../services/api";

import { Link } from "react-router-dom";
import LogoLOP from "components/ui/logoLOP.component";

export default class recoverScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      email: "",
      msgEmail:'',
      msg: "",
      erro:false,
      loading:false,
    };
  }
  componentDidMount() {
    document.title = "Recuperar Senha - Plataforma LOP";
  }
  async send(e){
    e.preventDefault();
    const request = {
      email: this.state.email
    };
    try{
      this.setState({loading:true})
      const response = await api.post('/auth/forgotpassword',request)         
      this.setState({
        loading:false,
        erro:false,
        msg: response.data,
        msgEmail:''
      })
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err))
      this.setState({
        loading:false,
        msgEmail:'',
        erro:false,
        msg:''
      })
      if(err.message==='Request failed with status code 400'){
          this.setState({msgEmail:err.response.data})
      }
      else{
        this.setState({
          msg:'Falha na conexão com o servidor :(',
          erro:true
        })
      }
    };
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  render() {
    const {email,msgEmail,erro,msg,loading,error} = this.state
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={(e) =>this.send(e)}>
          <div className="card-body p-6">
            <LogoLOP/>
            <div className="card-title">Recuperação de senha</div>
            <div className="form-group">
              <span className={`alert-${erro?'danger':'success'}`}>
                {msg}
              </span>
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className={`form-control ${msgEmail && 'is-invalid'}`} 
                placeholder="Digite seu e-mail"
                value={email}
                onChange={this.handleEmailChange}
                required
              />
              <div className="invalid-feedback">{msgEmail}</div>
            </div>
            <div className="form-footer">
              <button type="submit" className={`btn btn-primary btn-block ${loading && 'btn-loading'}`}>
                Enviar
              </button>
            </div>
          </div>
        </form>
        <div className="text-center text-muted">
          Não tem conta? <Link to="/autenticacao/cadastro"> cadastre-se</Link>
        </div>
        <br />
      </TemplateAutenticacao>
    );
  }
}
