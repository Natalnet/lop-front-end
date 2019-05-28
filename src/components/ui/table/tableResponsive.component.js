/*
 * @Author: Orivaldo
 * @Date: 2019-01-27 12:11:20
 */

import React, { Component } from "react";

export default class TableResponsive extends Component {


  render() {
    let teste = this.props.children.data[0]; 
    console.log( teste );
    /*for(var k in teste) {
      console.log( teste[k].nome);
    }*/
    return (
      <div className="table-responsive">

      <table className="table card-table table-vcenter text-nowrap datatable">
        <thead>
          <tr>
            <th className="w-1">Matrícula </th>
            <th>Nome </th>
            <th>Acerto (%) </th>
            {this.props.children.questoes.map( q => (<th key={q}>{q}</th>) ) }
          </tr>
        </thead>

        <tbody>
        {this.props.children.alunos.map(q => 
          <tr key={q.nome}>
            <td ><span className="text-muted"> {q.matricula} </span></td>
            <td> {q.nome} </td>
            <td> {q.acerto} </td>
             {q.questoes.map(qr =>(<td> {qr} </td>) )} 
          </tr>
          
        )} 
          

        </tbody>
      </table> 
    </div>


    );
  }
}
