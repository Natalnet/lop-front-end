import React from "react";

import { BrowserRouter, Switch} from "react-router-dom";

import autenticacao from "routes/autenticacao.routes";

import erros from "routes/erros.routes.js";

import aluno from "routes/aluno.routes";

const routes = (
  <BrowserRouter>
    <Switch>
      {autenticacao}
      {aluno}
      {erros}
    </Switch>
  </BrowserRouter>
);

export default routes;
