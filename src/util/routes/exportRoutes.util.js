import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes.util";
const exportRoutes = routes => {
  const perfil = localStorage.getItem("user.profile")
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
    else if(route.private === true || route.perfil !== perfil) {
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
