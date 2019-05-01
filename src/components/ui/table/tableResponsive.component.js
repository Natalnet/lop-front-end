/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

import React, { Component } from "react";

export default class tableResponsive extends Component {
  render() {
    return (
      <div className="table-responsive">

      <table className="table card-table table-vcenter text-nowrap datatable">
        <thead>
          <tr>
            <th className="w-1">No.</th>
            <th>Invoice Subject</th>
            <th>Client</th>
            <th>VAT No.</th>
            <th>Created</th>
            <th>Status</th>
            <th>Price</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td><span className="text-muted">001401</span></td>
            <td><a href="invoice.html" className="text-inherit">Design Works</a></td>
            <td>
              Carlson Limited
            </td>
            <td>
              87956621
            </td>
            <td>
              15 Dec 2017
            </td>
            <td>
              <span className="status-icon bg-success"></span> Paid
            </td>
            <td>$887</td>
            <td className="text-right">
               
            </td>
            <td>
               
            </td>
          </tr>
          

        </tbody>
      </table> 
    </div>


    );
  }
}
