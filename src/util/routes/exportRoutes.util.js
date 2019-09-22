import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes.util";
import { Redirect ,Link} from 'react-router-dom';
const exportRoutes = routes => {
  const perfil = sessionStorage.getItem("user.profile")
  console.log(perfil)
  const routesMap = routes.map((route, index) => {
    console.log(route.perfil)
    if (route.private === false) {
      return (
        <Route
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      );
    } 
    else if(route.private === true ) {
      return (
        <PrivateRoutes
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      );
    }
    
  });
  return routesMap;
};

export default exportRoutes;
