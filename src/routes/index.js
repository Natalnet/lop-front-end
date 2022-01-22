import React from "react";

import { BrowserRouter, Switch } from "react-router-dom";

import AutenticacaoRoutes from "../routes/autenticacao.routes";

import ErrosRoutes from "../routes/erros.routes.js";

import AlunoRoutes from "../routes/aluno.routes";

import ProfessorRoutes from "../routes/professor.routes";

import AdministradorRoutes from "../routes/administrador.routes";
import { AuthContextProvider } from "src/contexts/authContext";

const Routes = (
  <AuthContextProvider>
    <BrowserRouter>
      <Switch>
        {AutenticacaoRoutes}
        {AlunoRoutes}
        {ProfessorRoutes}
        {AdministradorRoutes}
        {ErrosRoutes}
      </Switch>
    </BrowserRouter>
  </AuthContextProvider>
);

export default Routes;
