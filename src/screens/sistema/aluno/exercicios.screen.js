import React, { useEffect } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import ExerciciosPaginadosScreen from "../../../components/screens/exerciciosPaginados.componenete.screen";

const QuestionsScreen = props => {

  useEffect(()=>{
    document.title = "Exercícios";
  },[])

  return (
    <TemplateSistema active="exercicios">
      <Row mb={15}>
        <Col xs={12}>
          <h5 style={{ margin: "0px" }}>Exercícios</h5>
        </Col>
      </Row>
      <ExerciciosPaginadosScreen
        {...props}
      />
    </TemplateSistema>
  );
}
export default QuestionsScreen;
