import React from "react";

import { Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes.util";
const exportRoutes = routes => {
  const routesMap = routes.map((route, index) => {
    if (route.private === false) {
      return (
        <Route
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      );
    } else {
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
