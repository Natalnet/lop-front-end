import React from "react";

import { BrowserRouter, Switch } from "react-router-dom";

import autenticacao from "routes/autenticacao.routes";

import erros from "routes/erros.routes.js";

import aluno from "routes/aluno.routes";

import administrador from "routes/administrador.routes";

const routes = (
  <BrowserRouter>
    <Switch>
      {autenticacao}
      {aluno}
      {administrador}
      {erros}
    </Switch>
  </BrowserRouter>
);

export default routes;
