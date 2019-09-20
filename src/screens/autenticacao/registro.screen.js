/*
 * @Author: Hemerson Rafael
 * @Date: 2019-05-03 16:35:20
 *
 */
import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import api from "../../services/api";

import { Link, Redirect } from "react-router-dom";

import Swal from "sweetalert2";
import LogoLOP from "components/ui/logoLOP.component";

export default class LoginScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      loading:false,
      name: "",
      enrollment: "",
      email: "",
      password: "",
      confirm_password: "",
      msg: "",
      msgName:'',
      msgEnrollment:'',
      msgEmail:'',
      msgPassoword:'',
      msgConfirm_password:''
    };
  }
  async register(e){
    e.preventDefault();

    const {name,email,enrollment,password,confirm_password} = this.state
    if (this.state.password !== this.state.confirm_password) {
      await this.setState({ msgConfirm_password : "A senha e confirmação de senha não correspondem" });
    }
    else{
      const request = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        enrollment: this.state.enrollment
      };
      try{
        this.setState({loading:true})
        const response = await api.post("/auth/register", request)
        await this.setState({
          msgName:'',
          msgEmail :'',
          msgEnrollment:'',
          msgPassoword:'',
          msgConfirm_password:'',
          msg:'',
          loading:false
        })
        Swal.fire({
          type: "success",
          title: `Confirme seu registro`,
          text: `Um email foi enviado para ${
            this.state.email
          }, use-o para confirmar seu cadastro na plataforma`,
          confirmButtonText: "Voltar para pagina de login"
        }).then(result => {
          if (result.value) {
           return this.setState({redirect:true});
          }
        })
      }
      catch(err){
        await this.setState({
          msgName:'',
          msgEmail :'',
          msgEnrollment:'',
          msgPassoword:'',
          msgConfirm_password:'',
          msg:'',
          loading:false
        })        
        if(err.message==='Request failed with status code 400'){
          this.setState({
            msgName: err.response.data.name || '',
            msgEmail :err.response.data.email || '',
            msgEnrollment:err.response.data.enrollment || '',
            msgPassoword:err.response.data.password || '',
          }) 
        }
        else{
          this.setState({msg:'Falha na conexão com o servidor :('})
        }

      }
    }
  };
  componentDidMount() {
    document.title = "Realizar Cadastro - Plataforma LOP";
  }
  handleNomeChange = e => {
    this.setState({ name: e.target.value });
  };
  handleEnrollmentChange = e => {
    this.setState({ enrollment: e.target.value });
  };
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };
  handleConfirmPasswordChange = e => {
    this.setState({ confirm_password: e.target.value });
  };
  render() {
    if(this.state.redirect){
      return <Redirect to="/"/>
    }
    const {name,email,enrollment,password,confirm_password,msg,loading} = this.state
    const {msgName,msgEmail,msgEnrollment,msgPassoword,msgConfirm_password}=this.state
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={(e)=> this.register(e)}>
          <div className="card-body p-6">
            <LogoLOP />
            <span className="alert-danger">{msg}</span>
            <div className="card-title">Faça o seu cadastro</div>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className={`form-control ${msgName && 'is-invalid'}`}
                placeholder="Digite seu nome"
                value={name}
                onChange={this.handleNomeChange}
                required
              />
              <div className="invalid-feedback">{msgName}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Matrícula</label>
              <input
                type="text"
                className={`form-control ${msgEnrollment && 'is-invalid'}`}
                placeholder="Digite sua matrícula"
                value={enrollment}
                onChange={this.handleEnrollmentChange}
                required
              />
              <div className="invalid-feedback">{msgEnrollment}</div>
            </div>
            <div className="form-group">
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
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className={`form-control ${msgPassoword && 'is-invalid'}`}
                placeholder="**********"
                value={password}
                onChange={this.handlePasswordChange}
                required
              />
              <div className="invalid-feedback">{msgPassoword}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirme sua senha</label>
              <input
                type="password"
                className={`form-control ${msgConfirm_password && 'is-invalid'}`}
                placeholder="**********"
                value={confirm_password}
                onChange={this.handleConfirmPasswordChange}
                required
              />
              <div className="invalid-feedback">{msgConfirm_password}</div>
            </div>

            <div className="form-footer">
              <button type="submit" className={`btn btn-primary btn-block ${loading && 'btn-loading'}`}>
                Cadastrar
              </button>
            </div>
          </div>
        </form>
        <div className="text-center text-muted">
          Já tem conta? <Link to="/"> Login</Link>
        </div>
        <br />
      </TemplateAutenticacao>
    );
  }
}
