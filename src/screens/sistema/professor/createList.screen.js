import React from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import FormCreateListScreen from '../../../components/screens/formList.subscree';
const CreateListScreen = props => {

  return (
    <TemplateSistema active="listas">
      <FormCreateListScreen {...props} />
    </TemplateSistema>
  );
  //}
}
export default CreateListScreen
