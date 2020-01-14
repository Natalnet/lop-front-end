import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoutes = ({ component: Component,perfil, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !sessionStorage.getItem("auth-token") ||
      !sessionStorage.getItem("user.name") ||
      !sessionStorage.getItem("user.email") ||
      (
        (sessionStorage.getItem("user.profile") !== "ALUNO") &&
        (sessionStorage.getItem("user.profile") !== "PROFESSOR")
      )
      ? (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      ) 
      : 
      sessionStorage.getItem("user.profile")!==perfil?
      (
        <Redirect to={{ pathname: `/${sessionStorage.getItem("user.profile").toLocaleLowerCase()}`, state: { from: props.location } }} />
      )
      :
      (
        <Component {...props} />
        
      )
    }
  />
);
