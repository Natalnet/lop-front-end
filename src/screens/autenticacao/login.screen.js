import React, { Component } from "react";
import TemplateAutenticacao from "components/templates/autenticacao.template";

import api from "../../services/api";

import { Link, Redirect } from "react-router-dom";
import LogoLOP from "components/ui/logoLOP.component";

export default class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false,
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
      sessionStorage.setItem("user.id", response.data.user.id);
      sessionStorage.setItem("user.profile", response.data.user.profile);
      sessionStorage.setItem("user.name", response.data.user.name);
      sessionStorage.setItem("user.email", response.data.user.email);
      sessionStorage.setItem("user.enrollment", response.data.user.enrollment);
      this.setState({ 
        redirect: true, 
        profile: response.data.user.profile,
        loading:false 
      });;
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err))
      await this.setState({
        loading:false,
        msgEmail:'',
        msgPass:'',
        msg:''
      })
      if(err.message==='Request failed with status code 400'){
        if(err.response.data==='O e-mail inserido não corresponde a nenhuma conta :('){
          this.setState({msgEmail:err.response.data})
        }
        else if(err.response.data==='Senha incorreta :('){
          this.setState({msgPass:err.response.data})
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
    if (this.state.redirect) {
      return <Redirect to={`/${sessionStorage.getItem("user.profile").toLocaleLowerCase()}`} />;
    }
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
        <br />
      </TemplateAutenticacao>
    );
  }
}
