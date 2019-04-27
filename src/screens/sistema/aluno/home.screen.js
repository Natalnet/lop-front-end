/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";

import {Link} from 'react-router-dom';

import TemplateSistema from "components/templates/sistema.template";

export default class HomeAlunoScreen extends Component {
  componentDidMount() {
    document.title = "Sistema Aluno - Plataforma LOP";
  }

  render() {
    return (
      <TemplateSistema>
        
      </TemplateSistema>
    );
  }
}
