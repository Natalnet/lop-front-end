import React from "react";

import TemplateSistema from "../../../components/templates/sistema.template";

import QuestionSubscreen from "../../../components/screens/question.subscreen";

const LessonQuestions = props => {
    return (
      <TemplateSistema {...props} active={"exercicios"}>
          <QuestionSubscreen
            {...props}
          />
      </TemplateSistema>
    );
}
export default LessonQuestions;
