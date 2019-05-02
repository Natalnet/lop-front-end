/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
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
            <th>LX-QX</th>
            <th>LX-QX</th>
            <th>LX-QX</th>
            <th>LX-QX</th>
            <th>LX-QX</th>
            <th>LX-QX</th>
            <th>LX-QX</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td><span className="text-muted">001401</span></td>
            <td> Orivaldo Santana </td>
            <td> Ok </td>
            <td> Ok </td>
            <td> Ok </td>
            <td> Ok </td>
            <td> - </td>
            <td> Ok </td>
            <td> Ok </td>
          </tr>
          

        </tbody>
      </table> 
    </div>


    );
  }
}
