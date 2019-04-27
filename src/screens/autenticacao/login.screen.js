/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import {Link} from 'react-router-dom';

export default class LoginScreen extends Component {
  componentDidMount() {
    document.title = "Realizar login - Plataforma LOP";
  }

  render() {
    return (
      <TemplateAutenticacao>
        <form className="card">
          <div className="card-body p-6">
		  	<div style={{textAlign:"center"}}>
				<img
				className="h-9"
				alt="Logo sistema"
				src="/assets/images/logo.png"
				/>
			</div>
            <div className="card-title">Faça login na sua conta</div>
            <div className="form-group">
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digire seu e-mail"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Senha
                <Link to="/autenticacao/recuperar-senha" className="float-right small">
                  Esqueci a senha
                </Link>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
              />
            </div>
            <div className="form-group">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" />
                <span className="custom-control-label">Lembrar-me</span>
              </label>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
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
