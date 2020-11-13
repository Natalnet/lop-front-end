import LoginScreen from "../screens/autenticacao/login.screen";
import SignScreen from "../screens/autenticacao/registro.screen";
import ConfirmRegisterScreen from "../screens/autenticacao/confirmRegister.screen";
import RecoverScreen from "../screens/autenticacao/recoverPassword.screen";
import ResetScreen from "../screens/autenticacao/resetPassword.screen";

import exportRoutes from "../util/routes/exportRoutes.util";

const routes = [
  {
    path: "/",
    component: LoginScreen,
    private: false
  },
  {
    path: "/autenticacao/cadastro",
    component: SignScreen,
    private: false
  },
  {
    path: "/autenticacao/confirmar-cadastro",
    component: ConfirmRegisterScreen,
    private: false
  },
  {
    path: "/autenticacao/recuperar-senha",
    component: RecoverScreen,
    private: false
  },
  {
    path: "/autenticacao/resetar-senha",
    component: ResetScreen,
    private: false
  }
];

export default exportRoutes(routes);
