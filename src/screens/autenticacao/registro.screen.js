/*
 * @Author: Hemerson Rafael
 * @Date: 2019-05-03 16:35:20
 *
 */
import React, { Component } from "react";
import TemplateAutenticacao from "../../components/templates/autenticacao.template";
import api from "../../services/api";
import { Link } from "react-router-dom";
import LogoLOP from "../../components/ui/logoLOP.component";

export default class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMenssageSendMail: false,
      loading:false,
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      msg: "",
      msgName:'',
      msgEmail:'',
      msgPassoword:'',
      msgConfirm_password:''
    };
  }
  componentDidMount() {
    document.title = "Realizar Cadastro - Plataforma LOP";
  }
  async register(e){
    e.preventDefault();

    const {name,email,password,confirm_password} = this.state
    if (password !== confirm_password) {
      await this.setState({ msgConfirm_password : "A senha e confirmação de senha não correspondem" });
    }
    else{
      const request = {
        name: name,
        email: email,
        password: password,
      };
      try{
        this.setState({loading:true})
        await api.post("/auth/register", request)
        await this.setState({
          showMenssageSendMail:true,
          loading:false
        })
      }
      catch(err){
        await this.setState({
          msgName:'',
          msgEmail :'',
          msgPassoword:'',
          msgConfirm_password:'',
          msg:'',
          loading:false
        })        
        if(err.response && err.response.status===400){
          console.log(err.response.data);
          for(let fieldErro of err.response.data){
            if(fieldErro.field==="name"){
              this.setState({msgName:fieldErro.msg})
            }
            if(fieldErro.field==="email"){
              this.setState({msgEmail:fieldErro.msg})
            }
          
            if(fieldErro.field==="password"){
              this.setState({msgPassoword:fieldErro.msg})
            }
          }
          /*this.setState({
            msgName: err.response.data.name || '',
            msgEmail :err.response.data.email || '',
            msgPassoword:err.response.data.password || '',
          })*/
        }
        else{
          this.setState({msg:'Falha na conexão com o servidor :('})
        }

      }
    }
  };

  handleNomeChange = e => {
    this.setState({ name: e.target.value });
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
    const {name,email,password,confirm_password,msg,loading} = this.state
    const {msgName,msgEmail,msgPassoword,msgConfirm_password}=this.state
    if(this.state.showMenssageSendMail){
      return(
        <TemplateAutenticacao>
          <div className="alert alert-light" role="alert">
            <h4 className="alert-heading">Confirme seu cadastro!</h4>
            <p>
              {`Um email foi enviado para ${email}, use-o para confirmar seu cadastro na plataforma!`}
            </p>
          </div>
        </TemplateAutenticacao>
        )
    }
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
