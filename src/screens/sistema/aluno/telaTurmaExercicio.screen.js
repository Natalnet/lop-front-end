import React from "react";

import TemplateSistema from "../../../components/templates/sistema.template";

import QuestionSubscreen from "../../../components/screens/question.subscreen";

const ClassQuestionByListScreen = props => {
    return (
      <TemplateSistema {...props} active={"listas"} submenu={"telaTurmas"}>
          <QuestionSubscreen
            {...props}
          />
      </TemplateSistema>
    );
}
export default ClassQuestionByListScreen;
