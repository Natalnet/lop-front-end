import React, { Component } from "react";
import TemplateAutenticacao from "components/templates/autenticacao.template";

import api from "../../services/api";
import NatalNet from "../../assets/images/logo.jpeg"
import { Link } from "react-router-dom";
import LogoLOP from "components/ui/logoLOP.component";

export default class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      msgEmail: "",
      msgPass:'',
      email: "",
      msg:'',
      password: "",
      loading:false,
      profile: "ALUNO"
    }
  }
  componentDidMount() {
    document.title = "Realizar login - Plataforma LOP";
  }
  async login(e){
    e.preventDefault();
    const request = {
      email: this.state.email,
      password: this.state.password
    }
    try{
      this.setState({loading:true})
      const response = await api.post("/auth/authenticate", request)
      sessionStorage.setItem("auth-token", response.data.token);
      sessionStorage.setItem("user.profile", response.data.user.profile);
      sessionStorage.setItem("user.name", response.data.user.name);
      sessionStorage.setItem("user.email", response.data.user.email);
      sessionStorage.setItem("user.urlImage", response.data.user.urlImage || "");
      this.props.history.push(`/${sessionStorage.getItem("user.profile").toLocaleLowerCase()}`)

    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err))
      await this.setState({
        loading:false,
        msgEmail:'',
        msgPass:'',
        msg:''
      })
      if(err.response && err.response.status===400){
        if(err.response.data.msg==='O e-mail inserido não corresponde a nenhuma conta :('){
          this.setState({msgEmail:err.response.data.msg})
        }
        else if(err.response.data.msg==='Senha incorreta :('){
          this.setState({msgPass:err.response.data.msg})
        }
      }
      else{
        this.setState({msg:'Falha na conexão com o servidor :('})
      }
    }     
  }

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };
  render() {
    
    const {msg,msgEmail,email,msgPass,password,loading} = this.state
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={(e) => this.login(e)}>
          <div className="card-body p-6">
            <LogoLOP/>
            <div className="card-title">Faça login na sua conta</div>
            <div className="form-group">
              <span className="alert-danger">
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
            <div className="form-group">
              <label className="form-label">
                Senha
                <Link
                  to="/autenticacao/recuperar-senha"
                  className="float-right small"
                >
                  Esqueci a senha
                </Link>
              </label>
              <input
                type="password"
                className={`form-control ${msgPass && 'is-invalid'}`}
                placeholder="**********"
                value={password}
                onChange={this.handlePasswordChange}
                required
              />
              <div className="invalid-feedback">{msgPass}</div>

            </div>

            <div className="form-footer">
              <button type="submit" className={`btn btn-primary btn-block ${loading && 'btn-loading'}`}>
                Entrar
              </button>
            </div>
          </div>
          
        </form>
        <div className="text-center text-muted">
          Não tem conta? <Link to="/autenticacao/cadastro"> cadastre-se</Link>
        </div>
        <div
            style={{
              padding:"0 32px",
              paddingTop:"32px",
              display:"flex",
              justifyContent:"center",
              alignItems: "center"
            }}
          >

            <a
              href="http://www.natalnet.br"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={NatalNet}
                alt="natalnet"
                style={{
                  maxWidth:"65px",
                  pointer:"cursor"
                }}
              />
              
            </a>
          </div>
        <br />
      </TemplateAutenticacao>
    );
  }
}
