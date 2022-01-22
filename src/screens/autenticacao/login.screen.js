import React, { useCallback, useContext, useEffect, useState } from "react";
import TemplateAutenticacao from "../../components/templates/autenticacao.template";

import api from "../../services/api";
import NatalNet from "../../assets/images/logo.jpeg"
import { Link, useHistory } from "react-router-dom";
import LogoLOP from "../../components/ui/logoLOP.component";
import { AuthContext } from "src/contexts/authContext";

const LoginScreen = () => {
  const { handleSetUser, isLoged } = useContext(AuthContext)
  const history = useHistory();
  const [msgEmail, setMsgEmail] = useState('')
  const [msgPass, setMsgPass] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')

  useEffect(() => {
    document.title = "Realizar login - Plataforma LOP";
  }, []);

  useEffect(()=>{
    if(isLoged){
      history.push(`/${sessionStorage.getItem("user.profile").toLocaleLowerCase()}`);
    }
  },[isLoged, history]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    const request = {
      email,
      password
    }
    try {
      setLoading(true);
      const response = await api.post("/auth/authenticate", request)

      handleSetUser({
        token: response.data.token,
        name: response.data.user.name,
        email: response.data.user.email,
        profile: response.data.user.profile,
        urlImage: response.data.user.urlImage,
      })
      setLoading(false);
   
    }
    catch (err) {
      // console.log(Object.getOwnPropertyDescriptors(err))
      setLoading(false);
      setMsgEmail('');
      setMsgPass('');
      setMsg('');
      if (err.response && err.response.status === 400) {
        if (err.response.data.msg === 'O e-mail inserido não corresponde a nenhuma conta :(') {
          setMsgEmail(err.response.data.msg);
        }
        else if (err.response.data.msg === 'Senha incorreta :(') {
          setMsgPass(err.response.data.msg);
        }
      }
      else {
        setMsg('Falha na conexão com o servidor :(');
      }
    }
  }, [email, password, handleSetUser]);

  return (
    <TemplateAutenticacao>
      <form className="card" onSubmit={handleLogin}>
        <div className="card-body p-6">
          <LogoLOP />
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
          padding: "0 32px",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "center",
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
              maxWidth: "65px",
              pointer: "cursor"
            }}
          />
        </a>
      </div>
      <br />
    </TemplateAutenticacao>
  );
}

export default LoginScreen;