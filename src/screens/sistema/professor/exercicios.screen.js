import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ExerciciosPaginados from "components/screens/exerciciosPaginados.componenete.screen";

const QuestionsScreen = (props)=>{

  useEffect(()=>{
    document.title = "Exercícios - professor";
  },[])

 
  return (
    <TemplateSistema active="exercicios">
      <Row mb={15}>
        <Col xs={12}>
          <h5 style={{ margin: "0px" }}>Exercícios</h5>
        </Col>
      </Row>
      <Row mb={15}>
        <Col xs={12}>
          <Link to="/professor/criarExercicio">
            <button className="btn btn-primary">Criar Exercício</button>
          </Link>
        </Col>
      </Row>
      <ExerciciosPaginados
        {...props}
      />
    </TemplateSistema>
  );
}
export default QuestionsScreen;
