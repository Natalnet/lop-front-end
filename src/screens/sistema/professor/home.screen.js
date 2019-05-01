/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";

import TableResponsive from "components/ui/table/tableResponsive.component";

import Card from "components/ui/card/card.component";

import CardHead from "components/ui/card/cardHead.component";

import CardBody from "components/ui/card/cardBody.component";


export default class HomeAlunoScreen extends Component {
  componentDidMount() {
    document.title = "Sistema Professor - Plataforma LOP";
  }

  render() {
    return (
      <TemplateSistema>

        <Card>
          <CardHead>
            Notas dos Alunos - Laboratório 
          </CardHead>
          <CardBody>
            <TableResponsive>

            </TableResponsive>
        </CardBody>
        </Card>
      </TemplateSistema>
    );
  }
}
