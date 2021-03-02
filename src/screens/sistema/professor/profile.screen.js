import React from 'react';
import ProfileSubScreenComponent from '../../../components/screens/profile.subscreen';
import TemplateSistema from "../../../components/templates/sistema.template";

const ProfileScreen = (props) => {

  return (
    <TemplateSistema {...props} >
      <ProfileSubScreenComponent {...props} />
    </TemplateSistema>
  )
}

export default ProfileScreen;