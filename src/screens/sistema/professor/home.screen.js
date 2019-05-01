/*
 * @Author: Orivaldo /  Marcus Dantas
 * @Date: 2019-04-01 12:11:20
 * @Last Modified by: Orivaldo 
 * @Last Modified time: 2019-04-01 17:49:17
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
