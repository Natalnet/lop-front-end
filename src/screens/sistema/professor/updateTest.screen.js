import React from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import FormTestSubscreen from '../../../components/screens/formTest.subscree'

const UpdateTestScreen = props => {
  return (
    <TemplateSistema active="provas">
      <FormTestSubscreen {...props} />
    </TemplateSistema>
  );
}

export default UpdateTestScreen;
