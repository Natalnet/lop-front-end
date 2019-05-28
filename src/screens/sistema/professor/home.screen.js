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

import axios from "axios";


export default class HomeAlunoScreen extends Component {
  constructor(){
    super();
    this.state = {
      data: {},   
      turma: "", 
      alunos: [],
      questoes: ['L1-Q05', 'L1-Q09', 'L1-Q10', 'L1-Q11', 'L1-Q12', 'L2-Q07',  'L2-Q10', 'L2-Q11', 'L2-Q12',  'L2-Q13', 'L4-Q02',  'L3-Q05', 'L3-Q06', 'L3-Q08', 'L3-Q12']
    };
  }
  async componentDidMount() {
    document.title = "Sistema Professor - Plataforma LOP";
    await this.populateAlunos();
  }

  populateAlunos = async () => {
    const request = await axios.get('http://localhost:3005/turma?nome=01D');
    if(request !== undefined){
      const data = request.data;
      console.log(data[0]);
      let cont = 0; 
      let nomeTurma = ""; 
      let alunos = []; 
      let questoes = []; 
       
      for(var k in data[0]) {
        if (cont === 0) {
          console.log("Turma: "+data[0][k])
          nomeTurma = data[0][k]; 
        }
        else {
          console.log( data[0][k]);
          alunos[cont-1] = data[0][k]; 
          if (cont === 1){
            questoes = data[0][k].questoes; 
          }
          let novoVetorQuestoes = [];
          let contJ = 0;
          let acerto = 0; 
          for (var c in data[0][k].questoes) {
            novoVetorQuestoes[contJ] = data[0][k].questoes[c];
            if(novoVetorQuestoes[contJ] === "OK" )
              acerto++; 
            contJ++; 
          }
          data[0][k].questoes = novoVetorQuestoes; 
          data[0][k].acerto = parseInt((acerto/contJ)*100); 
        }
        cont++; 
      }
      let vetorQuestoes = []; 
      cont = 0; 
      for (var q in questoes ){
        vetorQuestoes[cont] = q; 
        cont++; 
      }
      this.setState({data: data, turma: nomeTurma, alunos: alunos, questoes: vetorQuestoes })
    }
  };

  render() {
    return (
      <TemplateSistema>

        <Card>
          <CardHead>
            Notas Turma {this.state.turma} - Laboratório Unidade I
          </CardHead>
          <CardBody>
            <TableResponsive>
              { this.state }
            </TableResponsive>
        </CardBody>
        </Card>
      </TemplateSistema>
    );
  }
}
