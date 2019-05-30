/*
 * @Author: Orivaldo
 * @Date: 2019-01-27 12:11:20
 */

import React, { Component } from "react";

export default class TableResponsive extends Component {
  render() {
    return (
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th className="w-1">Matrícula </th>
              <th>Nome </th>
              <th>Acerto (%) </th>
              {this.props.children.questoes.map((q, index) => (
                <th key={index}>{q}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {this.props.children.alunos.map((q, index) => (
              <tr key={index}>
                <td>
                  <span className="text-muted"> {q.matricula} </span>
                </td>
                <td> {q.nome} </td>
                <td> {q.acerto} </td>
                {q.questoes.map((qr, index) => (
                  <td key={index}> {qr} </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
