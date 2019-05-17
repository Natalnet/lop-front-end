/*
 * @Author: Hemerson Rafael
 * @Date: 2019-05-03 16:35:20
 *
 */

import React, { Component } from "react";

import TemplateAutenticacao from "components/templates/autenticacao.template";

import { Link } from 'react-router-dom';

export default class LoginScreen extends Component {
  componentDidMount() {
    document.title = "Realizar Cadastro - Plataforma LOP";
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
            <div className="card-title">Faça o seu cadastro</div>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu nome"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Matrícula</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite sua matrícula"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Endereço de e-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu e-mail"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Senha
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Senha
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
              />
            </div>
            
            <div className="form-footer">
              <button type="submit" className="btn btn-primary btn-block">
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
