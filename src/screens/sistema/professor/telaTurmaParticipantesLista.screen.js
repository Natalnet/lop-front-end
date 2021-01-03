import React from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
import ClassListSubscreen from "../../../components/screens/classList.subscreen";

const ClassListStudantScreen = props => {
  return (
    <TemplateSistema {...props} active={"listas"} submenu={"telaTurmas"}>
      <ClassListSubscreen {...props} />
    </TemplateSistema>
  );
}
export default ClassListStudantScreen;
