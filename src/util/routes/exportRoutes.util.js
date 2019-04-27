import React from "react";

import { Route } from "react-router-dom";

const exportRoutes = routes => {
  const routesMap = routes.map((route, index) => {
    return (
      <Route key={index} exact path={route.path} component={route.component} />
    );
  });
  return routesMap;
};

export default exportRoutes;
