import React from "react";

import TemplateSistema from "../../../components/templates/sistema.template";

import QuestionSubscreen from "../../../components/screens/question.subscreen";

const ClassQuestionByTestScreen = props => {
    return (
      <TemplateSistema {...props} active={"provas"} submenu={"telaTurmas"}>
          <QuestionSubscreen
            {...props}
          />
      </TemplateSistema>
    );
}
export default ClassQuestionByTestScreen;
