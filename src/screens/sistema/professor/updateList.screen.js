import React from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import FormListScreen from '../../../components/screens/formList.subscree';
const UpdateListScreen = props => {

  return (
    <TemplateSistema active="listas">
      <FormListScreen {...props} />
    </TemplateSistema>
  );
  //}
}
export default UpdateListScreen
