import LoginScreen from "screens/autenticacao/login.screen";
import SignScreen from "screens/autenticacao/registro.screen";
import recoverScreen from "screens/autenticacao/recoverPassword.screen";
import resetScreen from "screens/autenticacao/resetPassword.screen"

import exportRoutes from "util/routes/exportRoutes.util";

const routes = [
  {
    path: "/",
    component: LoginScreen
  },
  {
    path: "/autenticacao/cadastro",
    component: SignScreen
  },
  {
    path: "/autenticacao/recuperar-senha",
    component: recoverScreen
  },
  {
    path: "/autenticacao/resetar-senha",
    component: resetScreen
  }
];

export default exportRoutes(routes);
