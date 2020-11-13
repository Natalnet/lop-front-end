import exportRoutes from "../util/routes/exportRoutes.util";
import UsuariosScreen from "../screens/sistema/administracao/usuarios.screen";

const routes = [
  {
    path: "/administrador",
    component: UsuariosScreen,
    private: true,
    perfil:"ADMINISTRADOR"
  }
];

export default exportRoutes(routes);
