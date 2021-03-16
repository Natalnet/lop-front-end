import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes.util";

const exportRoutes = routes => {
  const routesMap = routes.map((route, index) => {
    if (!route.private) {
      return (
        <Route
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      );
    } 
    else{
      return (
        <PrivateRoutes
          perfil={route.perfil}
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
