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
      msg: "",
      email: "",
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
      localStorage.setItem("auth-token", response.data.token);
      localStorage.setItem("user.profile", response.data.user.profile);
      localStorage.setItem("user.name", response.data.user.name);
      localStorage.setItem("user.email", response.data.user.email);
      localStorage.setItem("user.enrollment", response.data.user.enrollment);
      this.setState({ 
        redirect: true, 
        profile: response.data.user.profile,
        loading:false 
      });;
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err))
      this.setState({loading:false})
      if(err.message==='Request failed with status code 400'){
        this.setState({msg:err.response.data})
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
      if (this.state.profile === "ALUNO") {
        return <Redirect to="/aluno" />;
      } else if (this.state.profile === "PROFESSOR") {
        return <Redirect to="/professor" />;
      } else if (this.state.profile === "ADMINISTRADOR") {
        return <Redirect to="/sistema/administrador/usuarios" />;
      }
    }
    const {msg,email,password,loading} = this.state
    return (
      <TemplateAutenticacao>
        <form className="card" onSubmit={(e) => this.login(e)}>
          <div className="card-body p-6">
            <LogoLOP/>
            <div className="card-title">Faça login na sua conta</div>
            <div className="form-group">
              <span className="alert-danger">{msg}</span>
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={this.handleEmailChange}
                required
              />
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
                className="form-control"
                placeholder="**********"
                value={password}
                onChange={this.handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" />
                <span className="custom-control-label">Lembrar-me</span>
              </label>
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
